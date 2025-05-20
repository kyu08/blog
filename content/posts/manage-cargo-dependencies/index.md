---
title: "cargoプロジェクトで依存関係を継続的に管理する"
tags: ["cargo", "rust", "OSS"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2025-05-20T14:22:40+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

OSSに依存するプロジェクトでは依存しているライブラリのライセンス表記が必要になることがある。（体感的にはほとんどのライブラリはライセンス表記を求めているように思う）

そのため、依存ライブラリが増えた場合にはライセンス表記を更新する必要があるが、依存ライブラリの依存ライブラリに対しても再帰的にライセンス表記を見に行って自リポジトリの依存ライセンス表記ファイルを更新して...という作業を行うのは現実的ではない。

他にもうっかりコピーレフトなライブラリに依存してしまうとプロジェクトのライセンスを変更しなければならなかったりと案外注意すべきポイントが多い。

cargoプロジェクトにおいてこれらの労力を削減してくれるツールがいくつか存在している。

筆者は趣味プロジェクトとして`fzf-make`というmake targetやpnpm script, yarn script, just recipeをfuzzy finder形式で選択、実行できるCLIツール[^1]をRustで開発しており、このプロジェクトで最近それらのツールを導入したので使い方とともに紹介する。

## tl;dr
以下のチェックをCIで実行することでcargoプロジェクトの依存関係を継続的に省力で管理できる。

- [`cargo-machete`](https://github.com/bnjbvr/cargo-machete): 不要な依存関係がないか
- [`cargo-deny`](https://github.com/EmbarkStudios/cargo-deny): 依存ライブラリに許容しないライセンスが含まれていないか
- [`cargo-about`](https://github.com/EmbarkStudios/cargo-about): リポジトリのライセンス表記ファイルに更新漏れがないか

それぞれ紹介する。なお、コード例はそれぞれ以下のランナーを想定している。

| 環境 | ランナー |
|-- | -- |
| ローカル | make |
| CI | GitHub Actions |

## `cargo-machete`で不要な依存関係を検出する
### why
ある程度の期間開発を続けていると以前追加した依存関係が不要になったことに気付かずに`cargo.toml`の`dependencies`や`dev-dependencies`に残ったままになることがある。
不要な依存関係が残ったままになっているとrenovateやdependabotによるバージョン更新の手間が不必要に増えてしまうのでPRの時点で気付けるようにしたい。

### what
cargo-macheteを使って`cargo.toml`に記述されている依存関係のうち、プロジェクトが実際には依存していない依存関係を検出する。

### how(ローカル)
以下のようなmake targetを定義しておくと`make detect-unused-dependencies`で不要な依存関係を検出できる。
```makefile
.PHONY: tool-detect-unused-dependencies
tool-detect-unused-dependencies:
	@if ! which cargo-machete > /dev/null; then \
		cargo install --locked cargo-machete; \
	fi

.PHONY: detect-unused-dependencies
detect-unused-dependencies: tool-detect-unused-dependencies
	cargo machete
```

<!-- todo: 動いてる様子の画像を貼る -->

### how(CI)
以下のようなyamlを定義しておくと不要な依存関係がある場合にCIが落ちてくれる。
```yaml
name: Detect unused dependencies
on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  detect-unused-dependencies:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Machete
        uses: bnjbvr/cargo-machete@v0.8.0
```

## `cargo-deny`で依存ライブラリに許容しないライセンスが含まれていないか検証する
### why
筆者は`fzf-make`をより自由に利用してほしいと考えているためMITライセンスでプロジェクトを公開したい。
コピーレフトのライセンスに依存してしまうとライセンス変更を余儀なくされるため、コピーレフトのライブラリに依存することを避けたい。

### what
`cargo-deny`は依存関係のlint機能を提供する。`fzf-make`では、`cargo deny check licenses`を用いてホワイトリストに登録したライセンス以外のライセンスが依存ライブラリに含まれていないか検証している。

```toml
# deny.toml
[licenses]
allow = [
    "MIT",
    "ISC",
    "Apache-2.0",
    "MPL-2.0",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "Unicode-DFS-2016",
    "OpenSSL",
]
confidence-threshold = 0.8
exceptions = []

[[licenses.clarify]]
name = "ring"
expression = "MIT AND ISC AND OpenSSL"
license-files = [
    { path = "LICENSE", hash = 0xbd0eed23 }
]
```

### how(ローカル)
以下のようなmake targetを定義しておくと`make check-licenses`で依存ライブラリに許容しないライセンスが含まれていないかを検証できる。
```makefile
.PHONY: tool-check-licenses
tool-check-licenses:
	@if ! which cargo-deny > /dev/null; then \
		cargo install --locked cargo-deny; \
	fi

.PHONY: check-licenses
check-licenses: tool-check-licenses
	cargo deny check licenses
```

<!-- todo: スクショをはる -->


### how(CI)
以下のようなyamlを定義しておくと不要な依存関係があるとCIが落ちてくれる。
```yaml
name: Check licenses
on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  check-licenses:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: EmbarkStudios/cargo-deny-action@v2
      with:
        command: check licenses
```

## `cargo-about`でリポジトリのライセンス表記が最新か検証する
### why
冒頭でも触れた通り、多くのOSSでは依存ライブラリのライセンス表記を求めている。

`fzf-make`では`CREDITS.html`というファイルを用意しておりそこに依存ライブラリのライセンス表記を記載している。

これまでは依存ライブラリを追加/削除した際に手作業でライセンス表記ファイルを更新していたが、漏れがちになっていた。

また、本来は依存ライブラリの依存ライブラリを再帰的にチェックしてすべてのライセンス表記をすべきなのだと思うが、手作業でそれをする気にはなれなかったので直接依存しているライブラリのライセンスしか表記できていなかった。

これらの課題を`cargo-about`を用いることで解決できそうだったので導入してみた。

### what
`cargo-about`は依存ライブラリのライセンス表記ファイルを自動生成する機能を提供する。

以下のようなテンプレートを用意し、`cargo about generate about.hbs > CREDITS.html`を実行すると`CREDITS.html`にライセンス表記を出力してくれる。

```html
<html>
    <head>
        <style>
            @media (prefers-color-scheme: dark) {
                body {
                    background: #333;
                    color: white;
                }
                a {
                    color: skyblue;
                }
            }
            .container {
                font-family: sans-serif;
                max-width: 800px;
                margin: 0 auto;
            }
            .intro {
                text-align: center;
            }
            .licenses-list {
                list-style-type: none;
                margin: 0;
                padding: 0;
            }
            .license-used-by {
                margin-top: -10px;
            }
            .license-text {
                max-height: 200px;
                overflow-y: scroll;
                white-space: pre-wrap;
            }
        </style>
    </head>
    <body>
        <main class="container">
            <div class="intro">
                <h1>Third Party Licenses</h1>
                <p>This page lists the licenses of the projects used in fzf-make.</p>
            </div>
        
            <h2>Overview of licenses:</h2>
            <ul class="licenses-overview">
                {{#each overview}}
                <li><a href="#{{id}}">{{name}}</a> ({{count}})</li>
                {{/each}}
            </ul>

            <h2>All license text:</h2>
            <ul class="licenses-list">
                {{#each licenses}}
                <li class="license">
                    <h3 id="{{id}}">{{name}}</h3>
                    <h4>Used by:</h4>
                    <ul class="license-used-by">
                        {{#each used_by}}
                        <li><a href="{{#if crate.repository}} {{crate.repository}} {{else}} https://crates.io/crates/{{crate.name}} {{/if}}">{{crate.name}} {{crate.version}}</a></li>
                        {{/each}}
                    </ul>
                    <pre class="license-text">{{text}}</pre>
                </li>
                {{/each}}
            </ul>
        </main>
    </body>
</html>
```


### how(ローカル)
以下のようなmake targetを定義しておくと`make update-license-file`で依存ライブラリのライセンス表記が最新か検証できる。
```makefile
.PHONY: tool-update-license-file
tool-update-license-file:
	@if ! which cargo-about > /dev/null; then \
		cargo install --locked cargo-about; \
	fi

.PHONY: update-license-file
update-license-file: tool-update-license-file
	cargo about generate about.hbs > CREDITS.html
```

### how(CI)
以下のようなyamlを定義しておくと依存ライブラリのライセンス表記が最新でないとCIが落ちてくれる。
```yaml
name: Check license file
on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  check-license-file:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Check
        run: make update-license-file
      - name: Check diff
        run: |
          git add .
          git diff --cached --exit-code
```

なお、デフォルトだと以下の部分の`This page...fzf-make`の部分が`This page lists the licenses of the projects used in cargo-about.`として出力される。そのため、そのまま利用すると「`cargo-about`プロジェクトでは以下のライセンスに依存しています」という意味の表示になってしまうためユーザーが忘れずに`cargo-about`の部分をプロジェクト名に変更する必要があるという問題がある。[^2]

```html
<div class="intro">
    <h1>Third Party Licenses</h1>
    <p>This page lists the licenses of the projects used in fzf-make.</p>
</div>
```

これに関しては以下のissueを立ててみたので`cargo-about`側と意見が一致したら修正するPRを送ってみようと思う。

[[Feature request] change `cargo about init` to generate the statement including user's project name.](https://github.com/EmbarkStudios/cargo-about/issues/281)

## おわりに
繰り返しの定型タスクをCIに任せることができたので開発により集中できるようになった。（趣味開発だと数ヶ月ぶりにコミットするとかもザラにあり、開発に必要なタスクを忘れがちなのでそういった意味でも自動化の範囲を増やすことができてよかった）

便利ツールをOSSとして公開してくれている人/企業に感謝しつつ利用するだけでなく自分にできる貢献はやっていきたい。

[^1]: `fzf-make`の紹介記事: [[make,pnpm,yarn,justに対応]コマンドをfuzzy finder形式で選択できるCLIツール fzf-makeの紹介](https://zenn.dev/kyu08/articles/974fd8bc25c303)
[^2]: そして実際に[90件近くのプロジェクトで`cargo-about`のままになっている。](https://github.com/search?q=%22This+page+lists+the+licenses+of+the+projects+used+in+cargo-about.%22&type=code)
