"use client";
import { LuMapPin } from "react-icons/lu";
import { getWeatherCategory, getWeatherIcon, getWindDirectionLabel } from "@/app/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceArea } from "recharts";
import { useEffect, useState } from "react";
import { tideLocation } from "@/app/lib/data";
import type { TideData } from "@/app/types/Tide";
import { calcTideGradient } from "@/app/lib/utils";
import React from "react";

export default function Page() {
  //======================================================================
  //  state定義
  //======================================================================
  const [tideData, setData] = useState<TideData | null>(null);
  const [selected, setSelected] = useState(tideLocation[0]); // デフォルト＝和歌山
  const [activeZones, setActiveZones] = useState<{ start: string; end: string }[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);

  //======================================================================
  //  潮汐データのフェッチ
  //======================================================================
  useEffect(() => {
    const fetchTide = async () => {
      const resTide = await fetch(`/api/tide?loc=${selected.nameJp}`);
      const jsonTide = await resTide.json();
      setData(jsonTide);
    };
    fetchTide();
  }, [selected]);

  //======================================================================
  //  天気データのフェッチ
  //======================================================================
  useEffect(() => {
    const fetchWeather = async () => {
      const resWeather = await fetch(`/api/weather?lat=${selected.latitude}&lon=${selected.longitude}`);
      const jsonWeather = await resWeather.json();
      setWeatherData(jsonWeather);
    };
    fetchWeather();
  }, [selected]);

  //======================================================================
  // お天気アイコン
  //======================================================================
  const weatherCode = weatherData?.hourly?.weathercode?.[0] ?? 0;
  const weatherCategory = getWeatherCategory(weatherCode);
  const WeatherIcon = getWeatherIcon(weatherCategory);


  //======================================================================
  // 現在時刻を20分単位に丸めて "HH:mm"
  //======================================================================
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes() - (now.getMinutes() % 20)
  ).padStart(2, "0")}`;

  //======================================================================
  // 勾配を計算して「潮が速い区間」を抽出
  //======================================================================
  useEffect(() => {
    if (!tideData?.tide) return;
    const gradients = calcTideGradient(tideData.tide);

    const zones: { start: string; end: string }[] = [];
    for (let i = 0; i < gradients.length - 1; i++) {
      const g = gradients[i];
      if (Math.abs(g.rate ?? 0) >= 10) {
        zones.push({ start: tideData.tide[i].time, end: tideData.tide[i + 1].time });
      }
    }
    setActiveZones(zones);
  }, [tideData]);
  //======================================================================
  //読み込み中＝＞スケルトン実装したい（未定）
  //======================================================================
  if (!tideData || !weatherData) return <div>読み込み中...</div>;

  //======================================================================
  // 現在時刻の潮位データを特定する
  //======================================================================
  const currentPoint =
    tideData.tide.find((p) => p.time === hhmm) ??
    tideData.tide.reduce((a, b) =>
      Math.abs(a.time.localeCompare(hhmm)) <
        Math.abs(b.time.localeCompare(hhmm))
        ? a
        : b
    );
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 text-gray-100">
      <div className="max-w-2xl mx-auto py-10 pb-10">

        {/* 1. 日付 and 場所*/}
        <div className="text-center mb-3">
          <h1 className="text-7xl font-light tracking-tight text-cyan-400">{(() => {
            const d = new Date(tideData.date);
            const month = d.getMonth() + 1;
            const day = d.getDate();
            return `${month}/${day}`;
          })()}</h1>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <LuMapPin className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-medium text-gray-100">{tideData.harbor}</h2>
        </div>

        <div className="flex justify-center gap-25 mb-2 text-2xl">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 mb-1 font-small">Sunrise</span>
            <span className="font-medium text-orange-200">{tideData.sun.rise}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400 mb-1 font-small">Sunset</span>

            <span className="font-medium text-orange-400">{tideData.sun.set}</span>
          </div>
        </div>

        {/* チャート */}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={tideData.tide}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="oklch(87.2% 0.01 258.338)" ticks={["00:00", "06:00", "12:00", "18:00", "24:00"]} />
            <YAxis dataKey="height" stroke="oklch(87.2% 0.01 258.338)" ticks={["-40", "0", "100", "200"]} />
            <Tooltip />
            <Area type="monotone" dataKey="height" stroke="oklch(78.9% 0.154 211.53)" strokeWidth={3} fill="oklch(52% 0.105 223.128)" baseValue={-40} />
            {/* 潮流速いエリア*/}
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

        {/* 2. 天気カード */}
        <div className="bg-gray-800 backdrop-blur rounded-2xl p-6 mb-2 shadow-lg border border-slate-700/50">
          <h3 className="font-medium text-gray-400 block mb-3 border-b-1 inline-block pb-1">Weather Conditions</h3>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-8">

              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                {WeatherIcon}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">風向き</span>
                <span className="text-2xl font-semibold text-cyan-400">{getWindDirectionLabel(weatherData.hourly.winddirection_10m[0])}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">風速</span>
                <div className="flex item-center">
                  <span className="text-2xl font-semibold text-gray-200">{weatherData.hourly.windspeed_10m[0]}m/s</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400 block mb-1">気温</span>
                <span className="text-2xl font-semibold text-gray-200">{weatherData.hourly.temperature_2m[0]}℃</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. 釣りのコンディション */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl p-4 mb-2 border border-emerald-500/30">
          <h3 className="font-medium text-gray-400 border-b-1 inline-block mb-3">Fishing Conditions</h3>
          <div className="flex items-center justify-between">


            <span className="text-lg text-gray-200">潮位差: <span className="font-semibold text-cyan-400">170 cm</span></span>

          </div>
          <div className="mt-3 text-sm text-emerald-400 font-medium">釣りに適したコンディション</div>
        </div>

        {/* 4. マップ */}
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-800/20"></div>
          <div className="relative z-10 flex flex-col items-center justify-center py-16">
            <LuMapPin className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">Port Aerial View</h3>
            <p className="text-sm text-gray-500">(Coming Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
