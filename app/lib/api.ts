// app/lib/api.ts
import type { TideData } from "@/app/types/Tide";
import type { WeatherData } from "@/app/types/Weather";

/**
 * ベースURLを取得
 * Vercel環境では VERCEL_URL を使用
 */
function getBaseUrl() {
    // ブラウザ環境
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    // Vercel環境
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 環境変数で指定されたURL
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // ローカル開発環境
    return "http://localhost:3000";
}

/**
 * 潮汐データを取得（内部API経由）
 */
export async function getTideData(location: string): Promise<TideData> {
    const baseUrl = getBaseUrl();

    try {
        const res = await fetch(`${baseUrl}/api/tide?loc=${encodeURIComponent(location)}`, {
            next: { revalidate: 3600 }, // 1時間キャッシュ
            cache: "force-cache",
        });

        if (!res.ok) {
            throw new Error(`Tide API returned ${res.status}: ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch tide data:", error);
        throw error;
    }
}

/**
 * 天気データを取得（内部API経由）
 */
export async function getWeatherData(
    lat: number,
    lon: number
): Promise<WeatherData> {
    const baseUrl = getBaseUrl();

    try {
        const res = await fetch(`${baseUrl}/api/weather?lat=${lat}&lon=${lon}`, {
            next: { revalidate: 1800 }, // 30分キャッシュ
            cache: "force-cache",
        });

        if (!res.ok) {
            throw new Error(`Weather API returned ${res.status}: ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        throw error;
    }
}