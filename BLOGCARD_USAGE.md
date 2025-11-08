# ブログカード機能の使い方

## 概要

ブログカード（リンクプレビュー）機能を使用すると、外部サイトへのリンクを視覚的に魅力的なカード形式で表示できます。

## 基本的な使い方

### 1. 手動で情報を指定（推奨）

```markdown
{{< blogcard
  url="https://example.com"
  title="サイトのタイトル"
  description="サイトの説明文"
  image="https://example.com/image.png"
>}}
```

**手動指定が最も確実で安定しています。** タイトル、説明、画像を指定することで、即座に表示され、外部APIに依存しません。

### 2. URLのみを指定（自動OGP取得）

```markdown
{{< blogcard url="https://example.com" >}}
```

URLのみを指定すると、JavaScriptが自動的にOGP（Open Graph Protocol）メタデータを取得し、タイトル、説明、画像を表示します。

**注意**: 自動取得はプロキシ経由で行うため、不安定になることがあります。確実に表示したい場合は手動指定を推奨します。

### 3. 一部の情報のみ指定

```markdown
{{< blogcard url="https://example.com" title="カスタムタイトル" >}}
```

一部の情報のみを指定した場合でも、他の情報は自動取得されます。

## パラメータ

| パラメータ | 必須 | 説明 |
|-----------|------|------|
| `url` | ✓ | リンク先のURL |
| `title` | | カードに表示するタイトル（省略時は自動取得） |
| `description` | | カードに表示する説明文（省略時は自動取得） |
| `image` | | カードに表示する画像URL（省略時は自動取得） |
| `auto-fetch` | | `"true"`または`"false"`。自動取得の有効/無効を明示的に指定（デフォルト: `"true"`） |

## 使用例

### 例1: 手動指定（推奨）

```markdown
{{< blogcard
  url="https://github.com"
  title="GitHub: Where the world builds software"
  description="GitHub is where over 100 million developers shape the future of software, together."
  image="https://github.githubassets.com/images/modules/site/social-cards/github-social.png"
>}}
```

### 例2: シンプルなブログカード（自動取得）

```markdown
記事の本文...

{{< blogcard url="https://github.com" >}}

続きの本文...
```

**ヒント**: サイトのOGP画像URLを確認するには、そのサイトのHTMLソースを表示して `<meta property="og:image" content="...">` を探してください。

### すぐに試せる例

以下は実際に動作する例です。記事にコピー&ペーストして試してみてください：

```markdown
{{< blogcard
  url="https://github.com"
  title="GitHub"
  description="GitHub is where over 100 million developers shape the future of software, together."
  image="https://github.githubassets.com/images/modules/site/social-cards/github-social.png"
>}}

{{< blogcard
  url="https://www.rust-lang.org/"
  title="Rust Programming Language"
  description="A language empowering everyone to build reliable and efficient software."
  image="https://www.rust-lang.org/static/images/rust-social-wide.jpg"
>}}
```

### 例3: 自動取得を無効化

```markdown
{{< blogcard url="https://example.com" auto-fetch="false" >}}
```

## 注意事項

- **手動指定を推奨**: 最も確実で安定した表示方法です
- OGP情報の自動取得にはインターネット接続が必要です
- CORS制限を回避するため、プロキシサービス（allOrigins）を使用していますが、不安定になることがあります
- 一部のサイトではOGP情報が正しく取得できない場合があります。その場合は手動で情報を指定してください
- 自動取得はページ読み込み時に非同期で行われるため、表示されるまでに若干の時間がかかります

## デバッグ方法

自動取得がうまくいかない場合、ブラウザの開発者ツールのコンソールを確認してください。`[BlogCard]`というプレフィックスでデバッグログが表示されます。

デバッグモードを無効にするには、`static/blogcard.js`の7行目を以下のように変更してください：

```javascript
const DEBUG = false; // デバッグモード
```

## デザイン

ブログカードのデザインは以下の特徴があります：

- ダークテーマに対応
- レスポンシブデザイン（モバイルでは縦型レイアウトに切り替わる）
- ホバー時にアニメーション効果
- サイトのアクセントカラー（オレンジ）を使用

## カスタマイズ

CSSをカスタマイズする場合は、`static/style.css`の`.blogcard`セクションを編集してください。
