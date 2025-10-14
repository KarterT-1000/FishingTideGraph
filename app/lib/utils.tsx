//勾配算出するぞ
export function calcTideGradient(tide: { time: string; height: number }[]) {
    const gradients = [];

    for (let i = 1; i < tide.length; i++) {
        const prev = tide[i - 1];
        const curr = tide[i];

        // 時間差（分 → 時間）
        const [ph, pm] = prev.time.split(":").map(Number);
        const [ch, cm] = curr.time.split(":").map(Number);
        const deltaHours = ((ch * 60 + cm) - (ph * 60 + pm)) / 60;

        if (deltaHours <= 0) continue; // 日跨ぎ対策など

        const rate = (curr.height - prev.height) / deltaHours; // cm/h
        gradients.push({
            ...curr,
            rate,
        });
    }

    return gradients;
}

// app/lib/utils.ts
import { WiCloudy, WiRain, WiSnow, WiFog } from "react-icons/wi";
import { LuSun } from "react-icons/lu";
import type { WeatherCategory } from "../types/Weather";

export const getWeatherCategory = (code: number): WeatherCategory => {
    if (code === 0) return "sun";
    if ([1, 2, 3].includes(code)) return "cloudy";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "rain";
    if ([71, 73, 75, 77].includes(code)) return "snow";
    if ([45, 48].includes(code)) return "fog";
    return "unknown";
};

export const getWeatherIcon = (category: WeatherCategory) => {
    switch (category) {
        case "sun":
            return <LuSun className="w-12 h-12 text-cyan-400" />;
        case "cloudy":
            return <WiCloudy className="w-12 h-12 text-cyan-400" />;
        case "rain":
            return <WiRain className="w-12 h-12 text-cyan-400" />;
        case "snow":
            return <WiSnow className="w-12 h-12 text-cyan-400" />;
        case "fog":
            return <WiFog className="w-12 h-12 text-cyan-400" />;
        default:
            return <WiCloudy className="w-12 h-12 text-cyan-400 opacity-50" />;
    }
};

export const getWindDirectionLabel = (deg: number): string => {
    const dirs = [
        "北", "北北東", "北東", "東北東", "東",
        "東南東", "南東", "南南東", "南",
        "南南西", "南西", "西南西", "西",
        "西北西", "北西", "北北西", "北",
    ];
    const index = Math.round((deg % 360) / 22.5);
    return dirs[index];
};