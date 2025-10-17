<!-- このファイルは Secret Manager の運用メモです -->
# Secret 管理メモ
<!-- なぜ Secret Manager を使うのかを簡潔に説明します -->
パスワードや署名鍵を Git に残さないために、Google Secret Manager に保管します。
<!-- ドキュメントの該当箇所を参照して具体的な手順を示します -->
- docs/05_deploy_guide.md 2.5章に沿って `SESSION_SECRET` を四半期ごとにローテーションします。
<!-- ローカル作業の手順も書き、初心者が迷わないようにします -->
- ローカル開発では `env/.env.example` をコピーして `.env.local` を作成し、Secret Manager から取得した値を貼り付けます。