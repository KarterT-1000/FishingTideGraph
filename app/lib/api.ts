// app/lib/api.ts
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
 * 潮汐データを取得（内部API経由）
 */
export async function getTideData(location: string): Promise<TideData> {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/tide?loc=${encodeURIComponent(location)}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 }, // 1時間キャッシュ
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
    const url = `${baseUrl}/api/weather?lat=${lat}&lon=${lon}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 1800 }, // 30分キャッシュ
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

        return res.json();
    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        throw error;
    }
}