// app/components/LocationSelector.tsx
'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { tideLocation } from "@/app/lib/data";
import { useState, useEffect } from "react";

export default function LocationSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentLoc = searchParams.get('loc') || tideLocation[0].nameJp;
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(false);
    }, [currentLoc]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLoc = e.target.value;
        setIsNavigating(true);
        router.push(`/?loc=${encodeURIComponent(newLoc)}`);
    };

    // 県ごとにグループ化
    const locationsByPrefecture = tideLocation.reduce((acc, loc) => {
        const pref = loc.prefecture || '未分類';
        if (!acc[pref]) acc[pref] = [];
        acc[pref].push(loc);
        return acc;
    }, {} as Record<string, typeof tideLocation>);

    return (
        <div className="mb-4 flex justify-center">
            <div className="relative w-full max-w-xs">
                <select
                    value={currentLoc}
                    onChange={handleChange}
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2.5 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    style={{ textAlignLast: 'center' }}
                >
                    {Object.entries(locationsByPrefecture).map(([prefecture, locations]) => (
                        <optgroup key={prefecture} label={prefecture} className="text-left font-bold text-gray-300 bg-slate-700">
                            {locations.map((loc) => (
                                <option key={loc.nameJp} value={loc.nameJp} className="text-left pl-4 bg-slate-800">
                                    {loc.nameJp}
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>

                {/* ドロップダウンアイコン */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {isNavigating ? (
                        <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                    ) : (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    )}
                </div>
            </div>
            {isNavigating && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-sm text-blue-400 animate-pulse whitespace-nowrap">
                    📍 データを読み込んでいます...
                </div>
            )}
        </div>
    );
}