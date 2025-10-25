// app/components/SunTimeCard.tsx
type Props = {
    sunData: {
        rise: string;
        set: string;
    };
};

export default function SunTimesCard({ sunData }: Props) {
    return (
        <div className="flex justify-center gap-25 mb-2 text-2xl">
            <div className="flex flex-col items-center">
                <span className="text-gray-400 mb-1 font-small">Sunrise</span>
                <span className="font-medium text-orange-200">{sunData.rise}</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-gray-400 mb-1 font-small">Sunset</span>
                <span className="font-medium text-orange-400">{sunData.set}</span>
            </div>
        </div>
    );
}