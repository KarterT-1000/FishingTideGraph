import { getWeatherData } from "../lib/api";
import {
    getWeatherCategory,
    getWeatherIcon,
    getWindDirectionLabel,
    WeatherLabelMap,
} from "@/app/lib/utils";

type Props = {
    latitude: number;
    longitude: number;
};

export default async function WeatherCard({ latitude, longitude }: Props) {
    const weatherData = await getWeatherData(latitude, longitude);

    const weatherCode = weatherData?.hourly?.weathercode?.[0] ?? 0;
    const weatherCategory = getWeatherCategory(weatherCode);
    const WeatherIcon = getWeatherIcon(weatherCategory);
    const weatherLabel = WeatherLabelMap[weatherCategory];

    // 風速をkm/hからm/sに変換
    const windSpeedKmh = weatherData.hourly.windspeed_10m[0];
    const windSpeedMs = (windSpeedKmh / 3.6).toFixed(1);

    return (
        <div className="bg-gray-800 backdrop-blur rounded-2xl p-6 mb-4 shadow-lg border border-slate-700/50">
            <h3 className="font-medium text-gray-400 block mb-3 border-b-1 inline-block pb-1">
                Weather Conditions
            </h3>
            <div className="flex items-start gap-6">
                <div className="flex-shrink-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                        {WeatherIcon}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs text-gray-400 block mb-1">天気</span>
                        <span className="text-2xl font-semibold text-gray-200">
                            {weatherLabel}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 block mb-1">気温</span>
                        <div className="flex item-center">
                            <span className="text-2xl font-semibold text-gray-200">
                                {weatherData.hourly.temperature_2m[0]}℃
                            </span>
                        </div>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 block mb-1">風向き</span>
                        <span className="text-2xl font-semibold text-cyan-400">
                            {getWindDirectionLabel(weatherData.hourly.winddirection_10m[0])}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 block mb-1">最高風速</span>
                        <span className="text-2xl font-semibold text-gray-200">
                            {windSpeedMs}m/s
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}