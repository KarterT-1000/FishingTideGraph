// app/components/ConditionCard.tsx
import type { TideData } from "@/app/types/Tide";

type Props = {
    tideData: TideData;
};

export default function ConditionCard({ tideData }: Props) {
    // 潮位差の計算
    const heights = tideData.tide.map((p) => p.height);
    const maxHeight = Math.max(...heights);
    const minHeight = Math.min(...heights);
    const tideRange = Math.round(maxHeight - minHeight);

    // 釣りコンディションの判定
    let fishingCondition = "";
    if (tideRange >= 150) fishingCondition = "Conditions ◎ : 絶好の釣り日和";
    else if (tideRange >= 100)
        fishingCondition = "Conditions ○ : 潮の流れはおおよそ良好";
    else fishingCondition = "Conditions △ : 潮の流れが緩やか";

    return (
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl p-4 mb-4 border border-emerald-500/30">
            <h3 className="font-medium text-gray-400 border-b-1 inline-block mb-3">
                Fishing Conditions
            </h3>
            <div className="flex items-center justify-between">
                <span className="text-lg text-gray-200">
                    潮位差:{" "}
                    <span className="font-semibold text-cyan-400">{tideRange} cm</span>
                </span>
            </div>
            <div className="mt-3 text-sm text-emerald-400 font-medium">
                {fishingCondition}
            </div>
        </div>
    );
}