---
title: 'Makefileに定義されたtargetをfzfで選択して実行するCLIツールをRustでつくった'
publishedAt: '2023-03-31'
tags: ['rust', 'cli']
---

## つくったもの
Makefileに定義されたtargetをfzfで選択して実行するCLIツールをRustをつくった。

[https://github.com/kyu08/fzf-make](https://github.com/kyu08/fzf-make)

こんな感じで動く。

![fzf-make-demo](https://user-images.githubusercontent.com/49891479/228574753-2e0e46b8-b446-4b7d-b866-2362f33c9e17.gif)

brewコマンドでインストールできるので気になる方はぜひ。

```sh
brew tap kyu08/tap
brew install kyu08/tap/fzf-make
```

## やっていること
1. `Makefile`からtargetを正規表現で抜き出す
1. `skim`(※)にoptionとtargetたちを渡す
1. `skim`がプレビューウィンドウ付きのfuzzy-finderを表示
1. `skim`から選択されたtargetが返ってくるので`make ${target}`を実行

基本的な動作はすべて`skim`任せになっていてRust側でやっているのは`skim`とのやりとりくらいになっている。

※[lotabout/skim](https://github.com/lotabout/skim)...Rust製のfuzzy-finder。Rustのライブラリとして利用することもできる。

(makeの文法が思ったより多彩っぽかったので自分が必要とするごく簡単なユースケース以外をカバーするのは[早々に諦めた。](https://twitter.com/kyu08_/status/1639986936407531525)(makeで1冊本が書けるぐらいだしそれはそうという感じではある))

## 実装
上述の通り処理の大部分はskim任せになっている。(書いたコードは200行程度)

ただskimをライブラリとして利用する実装サンプルがあまりなかったのでちょっと大変だった。特にプレビューウィンドウの表示が地味に大変でfzfの候補文字列を変数としたシェルコマンドの形で渡すことができることに気づくまでに時間がかかった)

↓の`{}`にtarget名が入るイメージ。

```rust
let preview_command = r"line=$(bat Makefile | grep -nE '^{}\s*:' | sed -e 's/:.*//g'); bat --style=numbers --color=always --line-range $line: --highlight-line $line Makefile";
```

[https://github.com/kyu08/fzf-make/blob/3a627d0a1aa75b1bf1ff87f3443f63393afbcf10/src/misc.rs#L18](https://github.com/kyu08/fzf-make/blob/3a627d0a1aa75b1bf1ff87f3443f63393afbcf10/src/misc.rs#L18)

あとはgoでいつもやっている感じでテーブル駆動テストっぽくテストを書いてみた。可読性も保守性も高いので割と気に入っている。

[https://github.com/kyu08/fzf-make/blob/3a627d0a1aa75b1bf1ff87f3443f63393afbcf10/src/misc.rs#L145](https://github.com/kyu08/fzf-make/blob/3a627d0a1aa75b1bf1ff87f3443f63393afbcf10/src/misc.rs#L145)

## 動機
- Rustが書きたかった。(以上)

最近Rustのやっていきが高まっており、簡単な入門書を1周したので何か作ってみるぞーという機運とMakefileのターゲットをfuzzy-finderで絞り込めたら便利そうだなーという気持ちが重なったのでRustでfzf-makeを作ってみた。 (あとはskimというRustでfuzzy-finderをサクっと実装できるライブラリが存在していたのもかなり大きい。)

## Rustの感想
もともと「コンパイルが通りにくくて安全性が優れている」「関数型っぽい」という印象を持っていたので気になっていた。

実際に学んでみた印象は次のような感じ。

- 関数型っぽくて大変いい。特にenumとパターンマッチング,option,Result型, 式指向なところなど関数型っぽい言語機能など。 Elmの経験も生きている
- 開発体験がいい
  - エラーメッセージが丁寧
- コミュニティのサポート感がすごい(OSSのガイドとか)

- 大規模プロジェクトだとビルドが遅いっていう噂も聞くので気になる
- 保存のたびに`cargo check`が走るようにすると保存のたびに少し待たされるのでCIとかでのみ実行するようにして保存時には`cargo check`が走らないようにした方がよさそう。

## 便利だったツール
nextest
