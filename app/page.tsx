import { tideLocation } from "@/app/lib/data";
import { getTideData } from "@/app/lib/api";
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

  // 潮汐データは即座に取得（日の出日の入り表示のため）
  const tideData = await getTideData(selected.nameJp);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 text-gray-100">
      <div className="max-w-2xl mx-auto py-10 pb-10">
        {/* 日付 */}
        <DateCard date={tideData.date} />

        {/* ロケーションセレクター*/}
        <LocationSelector />

        {/* 日の出・日の入り */}
        <SunTimesCard location={selected.nameJp} />

        {/* 潮汐チャート */}
        <TideChart tideData={tideData} />

        {/* 天気カード*/}
        <WeatherCard
          latitude={selected.latitude}
          longitude={selected.longitude}
        />

        {/* 釣りコンディション */}
        <ConditionCard location={selected.nameJp} />

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