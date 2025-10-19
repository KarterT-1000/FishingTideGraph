![app](https://github.com/user-attachments/assets/929f21ed-d146-4e78-ba93-24abd884693b)

# Fishing App「エラー改修工事中につき使用禁止」

釣り情報を一目で確認できるWebアプリケーションです。潮汐データ、天気予報、釣りに適した時間帯などを表示します。

## ブラウザ
**[アプリを試す](https://fishing-app-kansai.vercel.app)**

## 機能

-  **今日の日付表示** - 日本時間（JST）で日付を表示
-  **潮汐データ** - その日の潮位をグラフで可視化
-  **日の出・日の入り時刻** - マズメの時間帯を表示
-  **天気予報** - 気温、降水確率、風速などの情報
-  **釣りコンディション判定** - 最大潮位差による簡単なコンディションを判定
-  **複数地点対応** - 現在は関西の主要釣りスポットのみ
-  **地図表示** - 各地点をおおよそ地図で表示

## 🛠️ 技術スタック

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **APIs**:
  - [Tide736 API](https://tide736.net/) - 潮汐データ
  - [Open-Meteo API](https://open-meteo.com/) - 天気予報
- **地図データ**:
  - [国土地理院](https://maps.gsi.go.jp)

## 🚀 セットアップ

### 必要な環境

- Node.js 18.x 以上（推奨：20.x または 22.x）
- pnpm（推奨）または npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/fishing-app.git
cd fishing-app

# 依存関係をインストール
pnpm install
# または
npm install

# 開発サーバーを起動
pnpm run dev
# または
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 環境変数（オプション）

`.env.local`ファイルを作成（本番環境用）：

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📁 プロジェクト構造

```
fishing-app/
├── app/
│   ├── api/
│   │   ├── tide/
|   |   |   └──route.ts    # 潮汐データAPI
│   │   └── weather/
|   |   |   └──route.ts    # 天気データAPI
│   ├── components/        # Reactコンポーネント
│   │   ├── ConditionCard.tsx
│   │   ├── DateCard.tsx
│   │   ├── LocationSelector.tsx
│   │   ├── SunTimesCard.tsx
│   │   ├── TideChartCard.tsx
│   │   └── WeatherCard.tsx
│   ├── lib/
│   │   ├── api.ts         # API呼び出し関数
│   │   ├── data.ts        # 地点データ
│   │   └── utils.tsx      # ユーティリティ関数
│   ├── types/             # TypeScript型定義
│   │   ├── Tide.ts
│   │   └── Weather.ts
│   └── page.tsx           # メインページ
├── public/                # Mapデータはすべてここの静的ファイルへ
└── next.config.ts         # Next.js設定
```

## 機能詳細

### 潮汐チャート
- 24時間の潮位変動を折れ線グラフで表示
- 現在時刻をマーカーで表示
- 潮どまり前後の特に流れが速い区間を強調表示

### 釣りコンディション判定
潮汐から以下を判定：
- 🟢 **最適**: 潮位差150cm以上
- 🟡 **良好**: 潮位差100cm以上
- 🔴 **不向き**: それ以外

### ロケーション切り替え
ドロップダウンメニューから簡単に地点を切り替え可能。切り替え時にはローディングアニメーションを表示。

## データ更新頻度

- **潮汐データ**: 30分ごとに更新
- **天気データ**: 30分ごとに更新
- **キャッシュ**: Next.jsのISR（Incremental Static Regeneration）で最適化

## レスポンシブデザイン

モバイル、タブレット、デスクトップすべてのデバイスで快適に利用できます。特に、モバイル時にもレイアウトが崩れないように設定している。

## コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## ライセンス

MIT License

## 謝辞

- [Tide736](https://tide736.net/) - 潮汐データAPI
- [Open-Meteo](https://open-meteo.com/) - 天気予報API
- [国土地理院](https://maps.gsi.go.jp) - 地図データ

## 📞 お問い合わせ

質問や提案がある場合は、Issueを作成してください。

---

Made with ❤️ for fishing enthusiasts
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
