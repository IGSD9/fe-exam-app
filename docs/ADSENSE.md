# AdSense 収益化メモ（基本情報 過去問アプリ）

サイト: https://fe-exam-app.vercel.app  
Publisher: `ca-pub-6139553494452890`

## コード側（実装済み）

- `public/ads.txt` → https://fe-exam-app.vercel.app/ads.txt
- 全ページに AdSense スクリプト（`components/ads/AdSenseScript.tsx`）
- 演習画面・トップにバナー枠（`BannerAd` / `HomeAd`）
- プライバシーポリシーに広告の記載あり

## あなたが AdSense 画面でやること

1. **お支払い** — 住所・銀行口座・本人確認を完了
2. **自動広告を ON**  
   「広告」→ サイト `fe-exam-app.vercel.app` →「自動広告を編集」→ 有効化 → 適用
3. **（任意）広告ユニット作成**  
   「広告」→「広告ユニット」→ ディスプレイ → スロット ID をコピー  
   → Vercel 環境変数 `NEXT_PUBLIC_ADSENSE_BANNER_SLOT` に設定して再デプロイ
4. **審査** — サイトが「要審査」のままなら、準備完了後に審査リクエスト（または数日待つ）
5. **ads.txt** — 公開済み。ステータスが「未承認」でも数日〜2週間かかることがある

## 確認 URL

- https://fe-exam-app.vercel.app/ads.txt
- https://fe-exam-app.vercel.app/privacy
- https://fe-exam-app.vercel.app/
