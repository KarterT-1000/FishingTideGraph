//天気のAPI（Open-Meteo API）
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json({ error: "Missing lat or lon" }, { status: 400 });
    }

    // 今日の日付を YYYY-MM-DD 形式で生成
    const today = new Date().toISOString().split("T")[0];

    // API URL（date を含めてキャッシュ切り替え）
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${today}&end_date=${today}&hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m,winddirection_10m`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 1800 }//キャッシュ30分
        });

        if (!res.ok) {
            return NextResponse.json({ error: "API Error" }, { status: 500 });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
    }
}
