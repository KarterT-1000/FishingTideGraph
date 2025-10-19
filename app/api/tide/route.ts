// app/api/tide/route.ts
import { NextResponse } from "next/server";
import { tideLocation } from "@/app/lib/data";
import type { TideData } from "@/app/types/Tide";
import { checkRateLimit } from "@/app/lib/rateLimit";

// メモリキャッシュ（Serverless Function内で有効）
const cache = new Map<string, { data: TideData; timestamp: number }>();
const CACHE_TTL = 3600000; // 1時間

function getJstNow() {
    const now = new Date();
    return new Date(now.getTime() + 9 * 60 * 60 * 1000);
}

function generateMockTideData(location: typeof tideLocation[0], now: Date): TideData {
    const date = now.toISOString().split('T')[0];
    const tide = [];

    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 20) {
            const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            const height = 100 + Math.sin((h * 60 + m) / 180) * 80;
            tide.push({
                time,
                height: Math.round(height),
                unix: now.getTime() + (h * 60 + m) * 60 * 1000,
            });
        }
    }

    return {
        date,
        harbor: location.nameJp,
        tide,
        sun: { rise: "06:00", set: "18:00" },
        current: {
            unix: now.getTime(),
            time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
        },
    };
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locName = searchParams.get("loc");
    const location = tideLocation.find(l => l.nameJp === locName);

    if (!location) {
        return NextResponse.json({ error: "location not found" }, { status: 404 });
    }

    const cacheKey = `${location.prefectureCode}-${location.harborCode}`;
    const now = getJstNow();

    // メモリキャッシュチェック
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log(`Cache HIT for ${cacheKey}`);
        return NextResponse.json(cached.data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                'X-Cache': 'HIT',
            },
        });
    }

    // レート制限チェック（1分間に1回まで）
    if (!checkRateLimit(cacheKey, 1, 60000)) {
        console.warn(`Rate limit exceeded for ${cacheKey}`);

        // キャッシュがあれば古くても返す
        if (cached) {
            return NextResponse.json(cached.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=60',
                    'X-Cache': 'STALE',
                },
            });
        }

        // なければモックデータ
        const mockData = generateMockTideData(location, now);
        return NextResponse.json(mockData, {
            headers: {
                'Cache-Control': 'public, s-maxage=60',
                'X-Data-Source': 'mock-rate-limited',
            },
        });
    }

    const yr = now.getFullYear();
    const mn = now.getMonth() + 1;
    const dy = now.getDate();
    const url = `https://api.tide736.net/get_tide.php?pc=${location.prefectureCode}&hc=${location.harborCode}&yr=${yr}&mn=${mn}&dy=${dy}&rg=day`;

    try {
        console.log(`Fetching tide data for ${cacheKey}`);

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(5000), // 5秒に短縮
        });

        if (!res.ok) {
            throw new Error(`API returned ${res.status}`);
        }

        const json = await res.json();
        const date = Object.keys(json.tide.chart)[0];
        const chart = json.tide.chart[date];

        const data: TideData = {
            date,
            harbor: json.tide.port.harbor_namej,
            tide: chart.tide.map((t: { time: string; cm: number; unix: number }) => ({
                time: t.time,
                height: t.cm,
                unix: t.unix,
            })),
            sun: {
                rise: chart.sun.rise,
                set: chart.sun.set,
            },
            current: {
                unix: now.getTime(),
                time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
            }
        };

        // メモリキャッシュに保存
        cache.set(cacheKey, { data, timestamp: Date.now() });
        console.log(`Cache SET for ${cacheKey}`);

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                'X-Cache': 'MISS',
            },
        });
    } catch (error) {
        console.error("Tide fetch failed:", error);

        // 古いキャッシュがあれば返す
        if (cached) {
            return NextResponse.json(cached.data, {
                headers: {
                    'Cache-Control': 'public, s-maxage=300',
                    'X-Cache': 'ERROR-FALLBACK',
                },
            });
        }

        // モックデータを返す
        const mockData = generateMockTideData(location, now);
        cache.set(cacheKey, { data: mockData, timestamp: Date.now() });

        return NextResponse.json(mockData, {
            headers: {
                'Cache-Control': 'public, s-maxage=300',
                'X-Data-Source': 'mock-error',
            },
        });
    }
}