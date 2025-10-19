//潮位API
import { NextResponse } from "next/server";
import { tideLocation } from "@/app/lib/data";
import type { TideData } from "@/app/types/Tide";

// JSTの現在日時を取得する関数
function getJstNow() {
    // 方法1: Dateオブジェクトから直接取得
    const now = new Date();
    console.log('UTC時刻:', now.toISOString());
    console.log('システムローカル時刻:', now.toString());

    // 方法2: JST文字列から作成
    const jstString = now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' });
    console.log('JST文字列:', jstString);
    const jstDate = new Date(jstString);
    console.log('JST Date:', jstDate.toString());

    return jstDate;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    //API場所データとdata.tsの場所が合致したとき取得
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

    const res = await fetch(url, {
        next: { revalidate: 1800 }//キャッシュ30分
    });
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

    return NextResponse.json(data);
}