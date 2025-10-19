// app/api/weather/route.ts
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/app/lib/rateLimit";

// 天気データの型定義
interface WeatherCacheData {
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        weathercode: number[];
        windspeed_10m: number[];
        winddirection_10m: number[];
    };
}

// メモリキャッシュ
const cache = new Map<string, { data: WeatherCacheData; timestamp: number }>();
const CACHE_TTL = 3600000; // 1時間

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ error: "Missing lat or lon" }, { status: 400 });
    }

    const cacheKey = `${lat}-${lon}`;

    // メモリキャッシュチェック
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log(`Weather cache HIT for ${cacheKey}`);
        return NextResponse.json(cached.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
                'X-Cache': 'HIT',
            },
        });
    }

    // レート制限（1分間に1回まで）
    if (!checkRateLimit(`weather-${cacheKey}`, 1, 60000)) {
        console.warn(`Weather rate limit exceeded for ${cacheKey}`);

        if (cached) {
            return NextResponse.json(cached.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=60',
                    'X-Cache': 'STALE',
                },
            });
        }

        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const today = new Date().toISOString().split("T")[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${today}&end_date=${today}&hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m,winddirection_10m`;

    try {
        console.log(`Fetching weather data for ${cacheKey}`);

        const res = await fetch(url, {
            signal: AbortSignal.timeout(5000),
        });

        if (!res.ok) {
            throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        // メモリキャッシュに保存
        cache.set(cacheKey, { data, timestamp: Date.now() });
        console.log(`Weather cache SET for ${cacheKey}`);

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
                'X-Cache': 'MISS',
            },
        });
    } catch (error) {
        console.error("Weather fetch failed:", error);

        // 古いキャッシュがあれば返す
        if (cached) {
            return NextResponse.json(cached.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300',
                    'X-Cache': 'ERROR-FALLBACK',
                },
            });
        }

        return NextResponse.json(
            { error: "Fetch failed", message: error instanceof Error ? error.message : 'Unknown' },
            { status: 500 }
        );
    }
}