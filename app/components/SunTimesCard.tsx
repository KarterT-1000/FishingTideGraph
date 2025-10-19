import { getTideData } from "../lib/api";

type Props = {
    location: string;
};

export default async function SunTimesCard({ location }: Props) {
    const tideData = await getTideData(location);

    return (
        <div className="flex justify-center gap-25 mb-2 text-2xl">
            <div className="flex flex-col items-center">
                <span className="text-gray-400 mb-1 font-small">Sunrise</span>
                <span className="font-medium text-orange-200">
                    {tideData.sun.rise}
                </span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-gray-400 mb-1 font-small">Sunset</span>
                <span className="font-medium text-orange-400">
                    {tideData.sun.set}
                </span>
            </div>
        </div>
    )
}