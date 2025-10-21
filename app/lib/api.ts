// app/lib/api.ts
import type { TideData } from "@/app/types/Tide";
import type { WeatherData } from "@/app/types/Weather";

/**
 * ベースURLを取得（シンプル版）
 */
function getBaseUrl() {
    // ブラウザ環境
    if (typeof window !== "undefined") {
        return "";
    }

    // Vercel環境
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // ローカル開発環境
    return "http://localhost:3000";
}

/**
 * 潮汐データを取得
 */
export async function getTideData(location: string): Promise<TideData> {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/tide?loc=${encodeURIComponent(location)}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
    }

    return res.json();
}

/**
 * 天気データを取得
 */
export async function getWeatherData(
    lat: number,
    lon: number
): Promise<WeatherData> {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/weather?lat=${lat}&lon=${lon}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
    }

    return res.json();
}