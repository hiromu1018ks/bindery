# Secret Manager 運用ガイド

## なぜ Secret Manager を使うのか
- 認証情報や署名鍵は Git に残さないため（漏えい防止）
- `docs/05_deploy_guide.md` 2.5 章で推奨されている四半期ローテーションを守るため
- Cloud Run へは `--set-secrets` で自動注入でき、手動設定ミスを防げるため

## 本番環境での手順
1. `SESSION_SECRET` などの値を生成する  
   `openssl rand -hex 32` で 128bit 以上の乱数を作成します。
2. Secret Manager に登録する  
   ```bash
   SECRET_NAME=session-secret
   openssl rand -hex 32 | gcloud secrets create $SECRET_NAME \
     --replication-policy=automatic \
     --data-file=-
   ```
3. Cloud Run デプロイ時に `--set-secrets SESSION_SECRET=projects/$PROJECT_ID/secrets/$SECRET_NAME:latest` を指定します。
4. ローテーション（四半期ごと）  
   ```bash
   openssl rand -hex 32 | gcloud secrets versions add $SECRET_NAME --data-file=-
   gcloud secrets versions list $SECRET_NAME
   gcloud secrets versions disable $SECRET_NAME-1   # 古いバージョンを無効化
   ```

## ローカル開発での手順
1. `backend/.env.example` を参考に `.env.local` を自分で作成します。
2. Secret Manager から取得した値を必要な箇所に貼り付けます。  
   例: `SESSION_SECRET`, `APP_USERNAME`, `APP_PASSWORD_HASH`
3. `.env.local` は `.gitignore` に含まれているためコミットしないことを確認します。
4. 開発サーバーを起動する前に `cp backend/.env.example backend/.env.local` などで雛形をコピーし、必要箇所だけ値を変更します。

## チェックリスト
- [ ] Secret Manager に最新の鍵が登録されている
- [ ] 古いバージョンは無効化されている
- [ ] ローカルの `.env.local` は最新の値に更新済み
- [ ] 機密情報がリポジトリにコミットされていない
