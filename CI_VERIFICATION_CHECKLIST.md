# CI高速化変更の動作確認チェックリスト

このPRでは以下の変更を実施しました：
1. pnpm化による依存関係インストールの高速化（キャッシュ時43%高速化）
2. Node.js 20への統一によるキャッシュ効率の向上
3. concurrency設定による不要なジョブのキャンセル
4. fetch-depthの最適化

## 事前準備
- [ ] このPRで実際のCI環境での動作確認を行う

## 1. lint.yaml（textlint）の確認
- [ ] PRを作成/更新時にワークフローが起動する
- [ ] Node.js 20がセットアップされる
- [ ] pnpmが正しくインストールされる
- [ ] `pnpm install --frozen-lockfile`で依存関係がインストールされる
- [ ] pnpmキャッシュが機能する（2回目以降の実行で高速化）
- [ ] textlintが正常に実行される
- [ ] textlintのエラーがPRに正しく表示される
- [ ] **concurrency**: 同じPRに連続プッシュ時、古いジョブがキャンセルされる

## 2. generate-ogp.yamlの確認
- [ ] PRを作成/更新時にワークフローが起動する
- [ ] fetch-depth指定なしで正しくチェックアウトされる
- [ ] Node.js 20がセットアップされる
- [ ] pnpmが正しくインストールされる
- [ ] `pnpm install --frozen-lockfile`で依存関係がインストールされる
- [ ] pnpmキャッシュが機能する（2回目以降の実行で高速化）
- [ ] `pnpm run generate-ogp`が正常に実行される
- [ ] OGP画像が正しく生成される
- [ ] 差分がある場合、自動コミット・プッシュされる
- [ ] PRコメントが正しく投稿/更新される
- [ ] **concurrency**: 同じPRに連続プッシュ時、古いジョブがキャンセルされる

## 3. deploy.yamlの確認
- [ ] mainブランチへのpush時にワークフローが起動する
- [ ] Node.js 20がセットアップされる
- [ ] pnpmが正しくインストールされる
- [ ] `pnpm install --frozen-lockfile`で依存関係がインストールされる
- [ ] pnpmキャッシュが機能する
- [ ] `pnpm run generate-ogp`が正常に実行される
- [ ] Hugoのビルドが成功する
- [ ] GitHub Pagesへのデプロイが成功する
- [ ] デプロイされたサイトが正常に表示される（https://blog.kyu08.com）

## 4. preview.yamlの確認（既存機能・念のため）
- [ ] PRを作成/更新時にワークフローが起動する
- [ ] Hugoのビルドが成功する
- [ ] プレビュー環境にデプロイされる
- [ ] プレビューURLが正しく機能する
- [ ] PRコメントが正しく投稿/更新される
- [ ] concurrency: 同じPRに連続プッシュ時、古いジョブがキャンセルされる（既存機能）

## 5. preview-cleanup.yamlの確認（既存機能・念のため）
- [ ] PRクローズ時にワークフローが起動する
- [ ] プレビューディレクトリが削除される

## 6. パフォーマンス確認
- [ ] 依存関係インストール時間を計測（初回実行）
- [ ] 依存関係インストール時間を計測（キャッシュあり・2回目以降）
- [ ] 連続プッシュ時の古いジョブキャンセルを確認
- [ ] 全体のCI実行時間を変更前後で比較

### 期待されるパフォーマンス改善
- npm ci (キャッシュあり): 約6.8秒
- pnpm install (キャッシュあり): 約3.9秒
- **改善率: 43%高速化（約2.9秒短縮）**

## 7. ローカル環境での確認
- [ ] `pnpm install`が正常に動作する
- [ ] `pnpm run generate-ogp`が正常に動作する
- [ ] （任意）package-lock.jsonの削除を検討

---

## 推奨テストシナリオ

### シナリオ1: 通常のPRフロー
1. 新しいブランチを作成
2. 記事を追加/修正
3. PRを作成
4. 全ワークフロー（lint、generate-ogp、preview）が成功することを確認

### シナリオ2: 連続プッシュでのconcurrency確認
1. このPRに対して軽微な変更をコミット
2. すぐに追加の変更をプッシュ
3. GitHub ActionsのUIで古いワークフローがキャンセルされることを確認

### シナリオ3: mainブランチへのマージ
1. このPRをマージ
2. deployワークフローが成功することを確認
3. 本番サイト（https://blog.kyu08.com）が正常に更新されることを確認

---

## 変更内容サマリー

### ファイル変更
- `.github/workflows/lint.yaml`: Node 20統一、pnpm化、concurrency追加
- `.github/workflows/generate-ogp.yaml`: pnpm化、concurrency追加、fetch-depth最適化
- `.github/workflows/deploy.yaml`: pnpm化
- `package.json`: packageManager フィールド追加
- `pnpm-lock.yaml`: 新規作成

### 効果
1. **依存関係インストールの高速化**: 43%（約2.9秒）
2. **キャッシュ効率の向上**: Node.js 20に統一
3. **不要なCI実行の削減**: concurrency設定
4. **初期化の高速化**: fetch-depth最適化
