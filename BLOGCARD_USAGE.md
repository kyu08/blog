# ブログカード機能の使い方

## 概要

ブログカード（リンクプレビュー）機能を使用すると、外部サイトへのリンクを視覚的に魅力的なカード形式で表示できます。

## 基本的な使い方

### 1. URLのみを指定（自動OGP取得）

```markdown
{{< blogcard url="https://example.com" >}}
```

URLのみを指定すると、JavaScriptが自動的にOGP（Open Graph Protocol）メタデータを取得し、タイトル、説明、画像を表示します。

### 2. 手動で情報を指定

```markdown
{{< blogcard url="https://example.com" title="サイトのタイトル" description="サイトの説明文" image="https://example.com/image.png" >}}
```

OGP情報を手動で指定することもできます。この場合、自動取得は行われません。

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

### 例1: シンプルなブログカード

```markdown
記事の本文...

{{< blogcard url="https://github.com" >}}

続きの本文...
```

### 例2: カスタム情報を指定

```markdown
{{< blogcard
  url="https://blog.example.com/article"
  title="おすすめの記事"
  description="この記事では〇〇について解説しています。"
  image="https://blog.example.com/images/thumbnail.png"
>}}
```

### 例3: 自動取得を無効化

```markdown
{{< blogcard url="https://example.com" auto-fetch="false" >}}
```

## 注意事項

- OGP情報の自動取得にはインターネット接続が必要です
- CORS制限を回避するため、プロキシサービス（allOrigins）を使用しています
- 一部のサイトではOGP情報が正しく取得できない場合があります。その場合は手動で情報を指定してください
- 自動取得はページ読み込み時に非同期で行われるため、表示されるまでに若干の時間がかかります

## デザイン

ブログカードのデザインは以下の特徴があります：

- ダークテーマに対応
- レスポンシブデザイン（モバイルでは縦型レイアウトに切り替わる）
- ホバー時にアニメーション効果
- サイトのアクセントカラー（オレンジ）を使用

## カスタマイズ

CSSをカスタマイズする場合は、`static/style.css`の`.blogcard`セクションを編集してください。
