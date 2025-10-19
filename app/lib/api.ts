import type { TideData } from "@/app/types/Tide";
import type { WeatherData } from "@/app/types/Weather";

/**
 * 潮汐データを取得（内部API経由）
 * app/api/tide/route.ts を呼び出す
 */
export async function getTideData(location: string): Promise<TideData> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tide?loc=${location}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch tide data: ${res.statusText}`);
    }

    return res.json();
}

/**
 * 天気データを取得（内部API経由）
 * app/api/weather/route.ts を呼び出す
 */
export async function getWeatherData(
    lat: number,
    lon: number
): Promise<WeatherData> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/weather?lat=${lat}&lon=${lon}`, {
        cache: 'no-store', // キャッシュ無効化（テスト用）
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch weather data: ${res.statusText}`);
    }

    return res.json();
}