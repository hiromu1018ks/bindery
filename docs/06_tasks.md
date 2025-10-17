# タスクリスト（初期実装ガイド）

## プロジェクト基盤
- [ ] リポジトリ構成と環境変数の初期整備を行い、`frontend/`・`backend/` ディレクトリと主要 .env テンプレートを準備する。必要な環境変数は `APP_USERNAME`/`APP_PASSWORD_HASH` 等を含め、Secret Manager への格納方針を明記する。（参考: `docs/01_requirements.md` 1章・6章, `docs/05_deploy_guide.md` 1章・9章）
- [ ] 開発・ステージング環境向けに Ghostscript を導入し、Docker ビルドで `gs` バイナリが最終イメージへコピーされることを確認する。ローカルでも CLI が使えるよう README を更新する。（参考: `docs/01_requirements.md` 5.4章, `docs/05_deploy_guide.md` 3.1章）

## バックエンド（Cloud Run / Node.js）
- [ ] 認証 API（`POST /auth/login` `POST /auth/logout`）を実装し、bcrypt 照合・セッション Cookie（12h/30m）・CSRF トークン発行を完備する。レート制限 5回/15分 および監査ログ出力を組み込む。（参考: `docs/01_requirements.md` 6章, `docs/04_api_spec.md` 2章）
- [ ] PDF 処理サービス層を構築し、結合/順序入替/分割/圧縮 API が pdf-lib と Ghostscript で仕様どおり動作するようにする。入出力上限（100MB・200頁・合計300MB）と `INVALID_RANGE` などのエラーコードを実装する。（参考: `docs/01_requirements.md` 5章・5.6章・8章, `docs/04_api_spec.md` 4章・6章）
- [ ] BullMQ と Cloud Memorystore (Redis) を用いたジョブキューを構築し、同期/非同期切替と `GET /jobs/{jobId}` 進捗ポーリング（load/process/write の百分率）を提供する。（参考: `docs/01_requirements.md` 5章・5.7章, `docs/02_basic_design.md` 3.7章・8章, `docs/05_deploy_guide.md` 2.6章）
- [ ] GCS 署名URL発行とファイル I/O 抽象化を実装し、アップロード→処理→結果保存→ライフサイクル削除フローを確立する。`/tmp/app/<jobId>/` の一時領域掃除もジョブ完了後10分で実行する。（参考: `docs/01_requirements.md` 3章・5.7章・9章, `docs/02_basic_design.md` 7章, `docs/04_api_spec.md` 3章）
- [ ] 共通エラーハンドリングと構造化ログ（`ts, requestId, user, size, pages, ms, sha8`）を整備し、HTTP レスポンスの Header (`X-Request-Id`, `Content-Disposition`) とセキュリティヘッダ (`CSP`, `Referrer-Policy`, `X-Content-Type-Options`) を付与する。（参考: `docs/01_requirements.md` 7章・12章, `docs/02_basic_design.md` 9章, `docs/04_api_spec.md` 7章・12章）

## フロントエンド（Vite + React）
- [ ] ログイン画面 S-01 を実装し、レスポンスヘッダの CSRF トークン保存・ログイン失敗カウント表示・ロックアウトメッセージを UI に反映する。（参考: `docs/03_ui_spec.md` S-01, `docs/01_requirements.md` 6章）
- [ ] ダッシュボード S-02 と各編集画面 S-03〜S-06 を構築し、ファイルアップロードのサイズ/拡張子/署名チェック、DnD 並び替え、範囲入力バリデーション、プリセット選択 UI を実装する。（参考: `docs/03_ui_spec.md` 1章・3章・4章, `docs/design.html` 該当セクション）
- [ ] ワークスペース画面 S-07 とチェーン実行機能を実装し、結果の保持・ダウンロード・「続けて…」メニューを通じたタスク遷移を管理する。Zustand 等で `auth`/`workspace`/`jobs` ストアを構築する。（参考: `docs/02_basic_design.md` 2.2章, `docs/03_ui_spec.md` 3章・6章）
- [ ] 進捗バーとジョブポーリング UI を実装し、同期/非同期に応じて `GET /jobs/{jobId}` の結果をハンドリングする。エラーコードに応じたトーストや入力欄エラー表示も整備する。（参考: `docs/03_ui_spec.md` 5章・7章・9章, `docs/04_api_spec.md` 5章・6章）

## 品質保証・運用
- [ ] 単体テスト（範囲パーサ、順序検証、サイズ上限制御、CSRF ミドルウェア）とゴールデンファイル比較テストを整備し、CI で自動実行できるようにする。（参考: `docs/01_requirements.md` 13章, `docs/02_basic_design.md` 13章）
- [ ] E2E テスト（100MB/200頁の操作、進捗% の単調増加、エラー系シナリオ）を設計し、ステージング環境で実行する手順を確立する。（参考: `docs/01_requirements.md` 13章・14章, `docs/03_ui_spec.md` 7章）
- [ ] Cloud Run / Vercel デプロイパイプラインを構築し、Artifact Registry へのビルド、`QUEUE_REDIS_URL`・`SESSION_SECRET` 等の環境変数設定、カスタムドメインマッピングを自動化する。（参考: `docs/05_deploy_guide.md` 2章・3章・4章・8章）
- [ ] ログ/監査の運用設計（例: Cloud Logging Sink、失敗ジョブ通知）と一時ファイル・GCS ライフサイクルの定期点検手順をまとめる。（参考: `docs/01_requirements.md` 7章・9章, `docs/02_basic_design.md` 9章, `docs/05_deploy_guide.md` 12章）

## セキュリティ・パフォーマンス
- [ ] アップロード入力の 3点検証（拡張子/MIME/署名）と Ghostscript 実行時の安全設定を確認し、潜在的なコマンドインジェクションや DoS への緩和策を文書化する。（参考: `docs/01_requirements.md` 7章, `docs/02_basic_design.md` 4章, `docs/04_api_spec.md` 8章）
- [ ] SameSite=Strict Cookie 運用、CORS 設定、HTTPS 必須構成を検証し、異なるドメイン構成時の fallback 手順を整理する。（参考: `docs/01_requirements.md` 3章・6章, `docs/05_deploy_guide.md` 5章）
- [ ] パフォーマンス目標（100MB/200頁を120秒以内）を満たすための負荷計測を実施し、Cloud Run の CPU/メモリ・最大インスタンス設定をチューニングする。（参考: `docs/01_requirements.md` 7章, `docs/05_deploy_guide.md` 3.3章・12章）
