'use client';
// app/error.tsx
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900 text-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-red-400 mb-4">
                    エラーが発生しました
                </h2>
                <p className="text-gray-300 mb-6">
                    データの取得に失敗しました。しばらくしてから再度お試しください。
                </p>
                <button
                    onClick={reset}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                    再試行
                </button>
            </div>
        </div>
    );
}