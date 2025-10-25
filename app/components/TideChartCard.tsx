// app/components/TideChartCard.tsx
"use client";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceDot,
    ReferenceArea,
} from "recharts";
import { useEffect, useState } from "react";
import { calcTideGradient } from "@/app/lib/utils";
import type { TideData } from "@/app/types/Tide";

type Props = {
    tideData: TideData;
};

export default function TideChart({ tideData }: Props) {
    const [activeZones, setActiveZones] = useState<
        { start: string; end: string }[]
    >([]);

    // 現在時刻を20分単位に丸める
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes() - (now.getMinutes() % 20)
    ).padStart(2, "0")}`;

    // 現在時刻の潮位データを特定
    const currentPoint =
        tideData.tide.find((p) => p.time === hhmm) ??
        tideData.tide.reduce((a, b) =>
            Math.abs(a.time.localeCompare(hhmm)) < Math.abs(b.time.localeCompare(hhmm))
                ? a
                : b
        );

    // 潮流の速い区間を計算
    useEffect(() => {
        if (!tideData?.tide) return;
        const gradients = calcTideGradient(tideData.tide);

        const zones: { start: string; end: string }[] = [];
        for (let i = 0; i < gradients.length - 1; i++) {
            const g = gradients[i];
            if (Math.abs(g.rate ?? 0) >= 10) {
                zones.push({
                    start: tideData.tide[i].time,
                    end: tideData.tide[i + 1].time,
                });
            }
        }
        setActiveZones(zones);
    }, [tideData]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart
                data={tideData.tide}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="time"
                    stroke="oklch(87.2% 0.01 258.338)"
                    ticks={["00:00", "06:00", "12:00", "18:00", "24:00"]}
                />
                <YAxis
                    dataKey="height"
                    stroke="oklch(87.2% 0.01 258.338)"
                    ticks={["-40", "0", "100", "200"]}
                />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="height"
                    stroke="oklch(78.9% 0.154 211.53)"
                    strokeWidth={3}
                    fill="oklch(52% 0.105 223.128)"
                    baseValue={-40}
                />
                {/* 潮流速いエリア */}
                {activeZones.map((z, i) => (
                    <ReferenceArea
                        key={i}
                        x1={z.start}
                        x2={z.end}
                        stroke="none"
                        fill="oklch(82.8% 0.111 230.318)"
                    />
                ))}
                {/* 現在地を点 */}
                <ReferenceDot
                    x={currentPoint.time}
                    y={currentPoint.height}
                    r={7}
                    fill="white"
                    stroke="oklch(25.8% 0.092 26.042)"
                    strokeWidth={2}
                    label={{
                        value: `${Math.ceil(currentPoint.height)}cm`,
                        position: "top",
                        fill: "white",
                        fontSize: 19,
                        fontWeight: 700,
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}