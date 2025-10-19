// app/lib/rateLimit.ts
/**
 * シンプルなインメモリレート制限
 * Vercel Serverless Functionsでも動作
 */

const requestLog = new Map<string, number[]>();

export function checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const requests = requestLog.get(key) || [];

    // 古いリクエストを削除
    const recentRequests = requests.filter(time => now - time < windowMs);

    // レート制限チェック
    if (recentRequests.length >= maxRequests) {
        console.warn(`Rate limit exceeded for ${key}`);
        return false;
    }

    // 新しいリクエストを記録
    recentRequests.push(now);
    requestLog.set(key, recentRequests);

    return true;
}

// 定期的にクリーンアップ
setInterval(() => {
    const now = Date.now();
    for (const [key, requests] of requestLog.entries()) {
        const recent = requests.filter(time => now - time < 60000);
        if (recent.length === 0) {
            requestLog.delete(key);
        } else {
            requestLog.set(key, recent);
        }
    }
}, 60000);