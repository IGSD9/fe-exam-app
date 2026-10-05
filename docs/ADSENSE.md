# AdSense 収益化メモ（基本情報 過去問アプリ）

サイト: https://fe-exam-app.vercel.app  
Publisher: `ca-pub-6139553494452890`

## ポリシー対応（コンテンツのない画面に広告を出さない）

- **全ページ共通の AdSense スクリプトは使わない**（`app/layout.tsx` に置かない）
- 広告は **問題文＋解説が表示された演習画面のみ**（`BannerAd` + `ensureAdSenseScript`）
- ダッシュボード・設定・一覧・読み込み中・トップのプレースホルダー枠には広告なし
- AdSense 管理画面で **自動広告は OFF** にすること

## 所有権

- `public/ads.txt` — 必須行は AdSense 画面と一致させる
- `metadata.other["google-adsense-account"]` — レイアウトに残す

## 再審査の手順

1. 本番デプロイ後、薄い画面に広告が出ていないことを確認
2. AdSense → **広告** → 自動広告 **OFF**
3. AdSense → **サイト** → `fe-exam-app.vercel.app` → **審査をリクエスト**
4. **ポリシー センター** の指摘が解消されているか確認

## 任意: バナーユニット

`NEXT_PUBLIC_ADSENSE_BANNER_SLOT` を Vercel に設定すると演習画面に手動バナーが出ます。
未設定時はスクリプトも読み込まず、審査向けに広告なしで運用できます。
