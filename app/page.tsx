// app/page.tsx
import { tideLocation } from "@/app/lib/data";
import { getTideData, getWeatherData } from "@/app/lib/api";
import DateCard from "./components/DateCard";
import SunTimesCard from "./components/SunTimesCard";
import LocationSelector from "./components/LocationSelector";
import WeatherCard from "./components/WeatherCard";
import ConditionCard from "./components/ConditionCard";
import TideChart from "./components/TideChartCard";
import Image from "next/image";

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ loc?: string }>;
};

export default async function Page(props: Props) {
  const params = await props.searchParams;
  const locationName = params.loc || tideLocation[0].nameJp;
  const selected = tideLocation.find((l) => l.nameJp === locationName) || tideLocation[0];

  console.time('⏱️ Total Server Render Time');
  console.time('📡 API Fetch Time');

  // 両方のデータを並列取得
  const [tideData, weatherData] = await Promise.all([
    getTideData(selected.nameJp),
    getWeatherData(selected.latitude, selected.longitude)
  ]);

  console.timeEnd('📡 API Fetch Time');
  console.timeEnd('⏱️ Total Server Render Time');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 text-gray-100">
      <div className="max-w-2xl mx-auto py-10 pb-10">
        {/* 日付 */}
        <DateCard date={tideData.date} />

        {/* ロケーションセレクター*/}
        <LocationSelector />

        {/* 日の出・日の入り */}
        <SunTimesCard sunData={tideData.sun} />

        {/* 潮汐チャート */}
        <TideChart tideData={tideData} />

        {/* 天気カード */}
        <WeatherCard weatherData={weatherData} />

        {/* 釣りコンディション */}
        <ConditionCard tideData={tideData} />

        {/* マップ */}
        <div className="flex justify-center my-4">
          <Image
            src={selected.mapImage}
            alt={`${selected.nameJp} の地図`}
            width={600}
            height={300}
            unoptimized
            className="rounded-xl border border-slate-700 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}