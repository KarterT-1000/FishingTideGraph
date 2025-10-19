import { formatJSTDate } from "@/app/lib/utils";

type Props = {
    date: string;
};

export default function DateCard({ date }: Props) {
    return (
        <div className="text-center mb-3">
            <h1 className="text-7xl font-light tracking-tight text-cyan-400">
                {formatJSTDate(date)}
            </h1>

        </div>
    );
}