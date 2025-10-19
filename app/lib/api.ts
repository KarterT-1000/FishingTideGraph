import type { TideData } from "@/app/types/Tide";
import type { WeatherData } from "@/app/types/Weather";

/**
 * 潮汐データを取得（内部API経由）
 */
export async function getTideData(location: string): Promise<TideData> {
    // サーバー側では相対パスで呼び出し可能
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/tide?loc=${location}`, {
        cache: `no-store`,//キャッシュはAPIでやっているのでなし
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch tide data: ${res.statusText}`);
    }

    return res.json();
}

/**
 * 天気データを取得（内部API経由）
 */
export async function getWeatherData(
    lat: number,
    lon: number
): Promise<WeatherData> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/weather?lat=${lat}&lon=${lon}`, {
        cache: `no-store`,//キャッシュはAPIでやっているのでなし
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch weather data: ${res.statusText}`);
    }

    return res.json();
}