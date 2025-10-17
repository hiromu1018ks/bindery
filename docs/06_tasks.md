# タスクリスト（学習効率を重視した推奨順）

自分一人で学びながら進める想定で、依存関係と学習効果を踏まえた順番でチェックリストを並べています。各タスクは該当ドキュメントを参照しながら進めてください。

1. [ ] **開発環境とリポジトリ骨子の準備**  
    `frontend/`・`backend/` ディレクトリ、主要 `.env` テンプレートの作成、必須環境変数（`APP_USERNAME` など）と Secret Manager 方針の整理。（参考: `docs/01_requirements.md` 1章・6章, `docs/05_deploy_guide.md` 1章・9章）
2. [ ] **Secret Manager 運用の体験**  
    `SESSION_SECRET` の登録・ローテーション手順を実際に試し、開発環境への反映方法もまとめる。（参考: `docs/05_deploy_guide.md` 2.5章）
3. [ ] **Cloud Memorystore (Redis) のプロビジョニング**  
    BullMQ 用 Redis を作成し、`QUEUE_REDIS_URL` を取得する工程を理解する。（参考: `docs/05_deploy_guide.md` 2.6章）
4. [ ] **Docker ビルドに Ghostscript を組み込む**  
    `gs` バイナリが最終イメージへコピーされることを確認し、ローカルでも Ghostscript を使えるようにする。（参考: `docs/01_requirements.md` 5.4章, `docs/05_deploy_guide.md` 3.1章）
5. [ ] **認証・セッション機能の実装**  
    `POST /auth/login` / `logout` を作り、bcrypt 照合・セッション Cookie（12h/30m）・CSRF トークン発行・レート制限を導入する。（参考: `docs/01_requirements.md` 6章, `docs/04_api_spec.md` 2章）
6. [ ] **GCS 署名URLとファイル I/O の実装**  
    署名付きアップロード→処理→結果保存→ライフサイクル削除のフローを構築し、一時領域 `/tmp/app/<jobId>/` のクリーンアップを実装する。（参考: `docs/01_requirements.md` 3章・5.7章・9章, `docs/02_basic_design.md` 7章, `docs/04_api_spec.md` 3章）
7. [ ] **PDF 処理サービス（結合/順序入替/分割/圧縮）の実装**  
    pdf-lib と Ghostscript を用いて各操作を実装し、上限チェック（100MB・200頁・総計300MB）と `INVALID_RANGE` などのエラーを返却する。（参考: `docs/01_requirements.md` 5章・5.6章・8章, `docs/04_api_spec.md` 4章・6章）
8. [ ] **BullMQ による非同期ジョブ管理**  
    同期/非同期切り替えと `GET /jobs/{jobId}` の進捗（load/process/write）を提供し、Redis との接続を確認する。（参考: `docs/01_requirements.md` 5.1〜5.5章・5.7章, `docs/02_basic_design.md` 3.7章・8章, `docs/05_deploy_guide.md` 2.6章）
9. [ ] **共通エラーハンドリングと構造化ログ**  
    `ts, requestId, user, size, pages, ms, sha8` を含むログ出力と、`X-Request-Id`・`Content-Disposition`・セキュリティヘッダ（`CSP`, `Referrer-Policy`, `X-Content-Type-Options`）を整備する。（参考: `docs/01_requirements.md` 7章・12章, `docs/02_basic_design.md` 9章, `docs/04_api_spec.md` 7章・12章）
10. [ ] **フロントエンドの状態管理基盤を構築**  
     Zustand などで `auth` / `workspace` / `jobs` ストアを準備し、データフローを把握する。（参考: `docs/02_basic_design.md` 2.2章, `docs/03_ui_spec.md` 2章）
11. [ ] **ログイン画面 S-01 の開発**  
     CSRF トークン保存、失敗回数表示、ロックアウトメッセージを含む UI を実装する。（参考: `docs/03_ui_spec.md` S-01, `docs/01_requirements.md` 6章）
12. [ ] **ダッシュボード S-02 と編集画面 S-03〜S-06 の実装**  
     ファイルアップロードの 3 点検証、DnD 並び替え、範囲入力バリデーション、圧縮プリセット選択を含める。（参考: `docs/03_ui_spec.md` 1章・3章・4章, `docs/design.html`）
13. [ ] **ワークスペース画面 S-07 とチェーン実行**  
     結果保持・ダウンロード・「続けて…」メニューを実装し、操作履歴を管理する。（参考: `docs/03_ui_spec.md` 3章・6章, `docs/01_requirements.md` 5.7章）
14. [ ] **進捗バーとジョブポーリング UI**  
     同期/非同期に応じて `GET /jobs/{jobId}` を扱い、エラーコード別にトーストや入力エラーを表示する。（参考: `docs/03_ui_spec.md` 5章・7章・9章, `docs/04_api_spec.md` 5章・6章）
15. [ ] **単体テスト・ゴールデンテストの整備**  
     範囲パーサ、順序検証、サイズ上限、CSRF ミドルウェアなどのテストを追加し、CI で実行可能にする。（参考: `docs/01_requirements.md` 13章, `docs/02_basic_design.md` 13章）
16. [ ] **E2E テストと異常系シナリオの検証**  
     100MB/200頁ケースやエラー応答を含むシナリオを作成し、ステージングで動作確認する。（参考: `docs/01_requirements.md` 13章・14章, `docs/03_ui_spec.md` 7章）
17. [ ] **デプロイパイプラインの構築**  
     Artifact Registry へのビルド、Cloud Run・Vercel へのデプロイ、自動での `QUEUE_REDIS_URL` / `SESSION_SECRET` 設定、カスタムドメインマッピングを設定する。（参考: `docs/05_deploy_guide.md` 2章・3章・4章・8章）
18. [ ] **ログ/監査と一時ファイル運用の整理**  
     Cloud Logging 連携や失敗ジョブ通知手順、一時領域・GCS ライフサイクルの定期点検をまとめる。（参考: `docs/01_requirements.md` 7章・9章, `docs/02_basic_design.md` 9章, `docs/05_deploy_guide.md` 12章）
19. [ ] **セキュリティ強化ポイントの明文化**  
     アップロード 3 点検証、Ghostscript 実行時の安全設定、CSRF/CORS/HTTPS 運用の fallback をドキュメント化する。（参考: `docs/01_requirements.md` 7章, `docs/02_basic_design.md` 4章, `docs/04_api_spec.md` 8章, `docs/05_deploy_guide.md` 5章）
20. [ ] **パフォーマンスチューニングとモニタリング**  
     100MB/200頁を 120 秒以内に処理できるか計測し、Cloud Run の CPU/メモリ・最大インスタンス設定を調整。計測方法と結果を記録する。（参考: `docs/01_requirements.md` 7章, `docs/05_deploy_guide.md` 3.3章・12章）
