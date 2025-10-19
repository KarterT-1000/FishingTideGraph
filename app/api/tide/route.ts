// app/api/tide/route.ts
import { NextResponse } from "next/server";
import { tideLocation } from "@/app/lib/data";
import type { TideData } from "@/app/types/Tide";

// JSTの現在時刻を取得する関数
function getJstNow() {
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // +9時間
    return jst;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    // API場所データとdata.tsの場所が合致したとき取得
    const locName = searchParams.get("loc");
    const location = tideLocation.find(l => l.nameJp === locName);

    if (!location) {
        return NextResponse.json({ error: "location not found" }, { status: 404 });
    }

    const now = getJstNow();
    const yr = now.getFullYear();
    const mn = now.getMonth() + 1;
    const dy = now.getDate();

    const url = `https://api.tide736.net/get_tide.php?pc=${location.prefectureCode}&hc=${location.harborCode}&yr=${yr}&mn=${mn}&dy=${dy}&rg=day`;

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Referer': 'https://www.tide736.net/',
            },
            next: { revalidate: 3600 }, // キャッシュ60分
            signal: AbortSignal.timeout(10000), // 10秒タイムアウト
        });

        if (!res.ok) {
            console.error("Tide API Error:", res.status, res.statusText);
            const errorText = await res.text();
            console.error("Error body:", errorText);
            return NextResponse.json(
                { error: "Tide API Error", status: res.status, details: errorText },
                { status: res.status }
            );
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

        console.log("API tide response date =", date);

        // キャッシュヘッダーを追加
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
            },
        });
    } catch (error) {
        console.error("Tide fetch failed:", error);
        return NextResponse.json(
            { error: "Fetch failed", message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
