import { SunInfo } from "./Weather";

// 港情報
export type TideLocation = {
    prefectureCode: number;
    harborCode: string;
    nameJp: string;
    latitude: number;
    longitude: number;
};

//一時データ
export type TidePoint = {
    time: string;
    height: number;
    rate?: number;
};

//時刻に関して
export type CurrentTime = {
    unix: number;
    time: string;
};

// APIレスポンス整形後の型
export type TideData = {
    date: string;
    harbor: string;
    tide: TidePoint[];
    sun: SunInfo;
    current: CurrentTime;
};