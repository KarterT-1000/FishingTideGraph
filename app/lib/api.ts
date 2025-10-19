import type { TideData } from "@/app/types/Tide";
import type { WeatherData } from "@/app/types/Weather";

/**
 * 潮汐データを取得（内部API経由）
 * app/api/tide/route.ts を呼び出す
 */
export async function getTideData(location: string): Promise<TideData> {
    // 相対パスで呼び出し（サーバー・クライアント両方で動作）
    const res = await fetch(`/api/tide?loc=${encodeURIComponent(location)}`, {
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
    // 相対パスで呼び出し（サーバー・クライアント両方で動作）
    const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch weather data: ${res.statusText}`);
    }

    return res.json();
}