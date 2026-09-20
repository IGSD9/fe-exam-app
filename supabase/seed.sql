INSERT INTO qualifications (id, title)
VALUES ('fe', '基本情報技術者試験')
ON CONFLICT (id) DO NOTHING;

-- 問題本文はアプリ側 lib/questions-seed.ts を正とする。
-- Supabase 投入時は `npm run seed:sql` でこのファイルを再生成する。
