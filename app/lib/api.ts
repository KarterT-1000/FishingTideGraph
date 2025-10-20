// app/lib/api.ts
import { cache } from 'react';
import type { TideData } from "@/app/types/Tide";
import type { WeatherData } from "@/app/types/Weather";

/**
 * ベースURLを取得（Vercel完全対応）
 */
function getBaseUrl() {
    // ブラウザ環境（クライアントサイド）
    if (typeof window !== "undefined") {
        return "";  // 相対パスでOK
    }

    // Vercel本番環境
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Vercelプレビュー環境
    if (process.env.VERCEL_BRANCH_URL) {
        return `https://${process.env.VERCEL_BRANCH_URL}`;
    }

    // カスタムドメイン
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // ローカル開発環境
    return "http://localhost:3000";
}

/**
 * 潮汐データを取得（Reactキャッシュで重複防止）
 * 同じlocationに対する複数回の呼び出しは自動的に1回にまとめられる
 */
export const getTideData = cache(async (location: string): Promise<TideData> => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/tide?loc=${encodeURIComponent(location)}`;

    //console.log(`🌊 Fetching tide data for: ${location}`);

    try {
        const res = await fetch(url, {
            next: { revalidate: 21600 }, // 6時間キャッシュ
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Tide API Error:", {
                status: res.status,
                statusText: res.statusText,
                error: errorData,
            });
            throw new Error(`Tide API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        //console.log(`✅ Tide data received for: ${location}`);
        return data;
    } catch (error) {
        //console.error("Failed to fetch tide data:", error);
        throw error;
    }
});

/**
 * 天気データを取得（Reactキャッシュで重複防止！！
 * ）
 */
export const getWeatherData = cache(async (
    lat: number,
    lon: number
): Promise<WeatherData> => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/weather?lat=${lat}&lon=${lon}`;

    //console.log(`☀️ Fetching weather data for: ${lat}, ${lon}`);

    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 }, // 1時間キャッシュ
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Weather API Error:", {
                status: res.status,
                statusText: res.statusText,
                error: errorData,
            });
            throw new Error(`Weather API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        //console.log(`✅ Weather data received`);
        return data;
    } catch (error) {
        //console.error("Failed to fetch weather data:", error);
        throw error;
    }
});