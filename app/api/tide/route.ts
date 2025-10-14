//API用
import { NextResponse } from "next/server";
import { tideLocation } from "@/app/lib/data";
import type { TideData } from "@/app/types/Tide";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locName = searchParams.get("loc") || "和歌山";

    const location = tideLocation.find(l => l.nameJp === locName);
    if (!location) {
        return NextResponse.json({ error: "location not found" }, { status: 404 });
    }

    const now = new Date();
    const yr = now.getFullYear();
    const mn = now.getMonth() + 1;
    const dy = now.getDate();

    const url = `https://api.tide736.net/get_tide.php?pc=${location.prefectureCode}&hc=${location.harborCode}&yr=${yr}&mn=${mn}&dy=${dy}&rg=day`;

    const res = await fetch(url, { next: { revalidate: 1800 } });//キャッシュ30分
    const json = await res.json();

    const date = Object.keys(json.tide.chart)[0];
    const chart = json.tide.chart[date];

    const data: TideData = {
        date,
        harbor: json.tide.port.harbor_namej,
        tide: chart.tide.map((t: any) => ({
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

    return NextResponse.json(data);
}
