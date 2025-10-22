![app](https://github.com/user-attachments/assets/929f21ed-d146-4e78-ba93-24abd884693b)

# 🪝🐟 Fishing App

関西エリアの釣り情報を一目で確認できるWebアプリケーションです。潮汐データ、天気予報、釣りに適した時間帯などをリアルタイムで表示します。

## ✨ 機能

- **今日の日付表示** - 日本時間（JST）で日付を表示
- **潮汐データ** - リアルタイムの潮位変動をグラフで可視化
- **日の出・日の入り時刻** - マヅメ目安の時間帯を把握
- **天気予報** - 気温、降水確率、風速などの詳細情報
- **釣りコンディション判定** - 潮位差から簡単にコンディションを判定
- **複数地点対応** - とりあえず関西の主要釣りスポット
- **地図表示** - 各地点の位置を地図で確認

## 🛠️ 技術スタック

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **APIs**:
  - [Tide736 API](https://tide736.net/) - 潮汐データ
  - [Open-Meteo API](https://open-meteo.com/) - 天気予報
- **地図**:
  - [国土地理院](https://maps.gsi.go.jp/) -地図データ 

## 🚀 セットアップ

### 必要な環境

- Node.js 18.x 以上
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

## 📁 プロジェクト構造

```
fishing-app/
├── app/
│   ├── api/
│   │   ├── tide/        
│   │   |　 └──route.ts  # 潮汐データAPI
│   │   └── weather/  
│   │    　 └──route.ts  # 天気データAPI
│   ├── lib/
│   │   ├── data.ts      # 地点データ
│   │   └── utils.tsx    # ユーティリティ関数
│   ├── types/           # TypeScript型定義
│   └── page.tsx         # メインページ
├── public/              # 静的ファイル
└── next.config.ts       # Next.js設定
```

## 🎨 機能詳細

### 潮汐チャート
- 24時間の潮位変動を折れ線グラフで表示
- 潮の流れが速い時間帯を強調表示

### 釣りコンディション判定
潮汐から以下を判定：
-  **最適**: 潮位差が150㎝以上。大潮・中潮
-  **良好**: 潮位差が100㎝以上。小潮
-  **不向き**: 潮位差が100㎝以下。穏やか

### ロケーション切り替え
ドロップダウンメニューから簡単に地点を切り替え可能。

## 🔄 データ更新頻度

- **潮汐データ**: 30分ごとに更新
- **天気データ**: 1日ごとに更新

## 📱 レスポンシブデザイン

モバイル、タブレット、デスクトップすべてのデバイスで快適に利用できます。

## 🤝 コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License

## 🙏 謝辞

- [Tide736](https://tide736.net/) - 潮汐データAPI
- [Open-Meteo](https://open-meteo.com/) - 天気予報API
- [国土地理院](https://maps.gsi.go.jp/) - 地図データ

## 📞 お問い合わせ

質問や提案がある場合は、Issueを作成してください。

良い釣りライフを！
