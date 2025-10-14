export type WeatherInfo = {
    icon: 'sun' | 'cloud' | 'rain';
    precipitation: number; //座標
    windDirection: string; // 方角
    windSpeed: number; //風速
    temperature: number; //温度
    waterTemp: number; //水温（表面）
};

//日の出と日の入り時刻
export type SunInfo = {
    rise: string;
    set: string;
}

export type WeatherCategory = "sun" | "cloudy" | "rain" | "snow" | "fog" | "unknown";