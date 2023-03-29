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

最近Rustのやっていきが高まっており、簡単な入門書を1周したので何か作ってみるぞーという機運とMakefileのターゲットをfuzzy-finderで絞り込めたら便利そうだなーという気持ちが重なったのでRustでfzf-makeを作ってみた。 (あとはskimの存在を知っていたのもかなり大きい。)

自分が欲しいCLIツールを手に入れつつRustの経験が積めたのでよかった。

## Rustを触ってみて感じたこと
Rustを触る前に持っていた印象は「コンパイルが通りにくくて安全性が優れている」「関数型っぽい」という感じだった。

実際に学んでみた印象は次のような感じ。

- 関数型っぽくてとてもいい。特にenumとパターンマッチング,option,Result型, 式指向なところなどの関数型っぽい言語機能や極力データをイミュータブルに扱う思想など。個人的にはElmの好きだった部分をほとんど含んでいるし、Elmを書いた経験も活きたので楽しくコードを書くことができた。(もちろん慣れてないこともあってElmよりも全然難しかったけど)
- ↑に近いがNull安全なことに加えて所有権などの概念のおかげでコンパイルが通りさえすればちゃんと動いてくれるという安心感がある。リファクタとかもやりやすそう。(enumにバリアントを追加したとき、パターンマッチの全箇所を修正しないとコンパイルが通らなかったりすると思うので)
- 開発体験が良い
  - エラーメッセージがとても丁寧。「ここがこう悪いで〜」とか「ここをこう直すとええで〜」みたいなことまでエラーメッセージに書いてくれてあるホスピタリティに感動した。初学者に優しい。
- コミュニティの初学者をサポートする姿勢がすごい
  - RustのOSSプロジェクトには [https://zenn.dev/fraternite/articles/4e11063bf05aac](https://zenn.dev/fraternite/articles/4e11063bf05aac) こちらの記事が詳しいが、Rust製のOSSプロジェクトには`E-mentor`というタグがありissueを進めるに当たってメンターが指針を記してくれているらしい。（[https://github.com/rust-lang/rust/issues/109099](https://github.com/rust-lang/rust/issues/109099) これとかすごい。）
- Elmやgoと比べて言語機能は豊富なので、動くものをつくるという観点ではそれらの言語よりも学習コストは高そう。ただRustをちゃんと書けるようになれば生産性高く安全なコードが書けると思うので学習コストを払うだけのメリットはありそう。
- 保存のたびに`cargo check`が走るようにすると保存のたびに少し待たされるのでCIとかでのみ実行するようにして保存時には`cargo check`が走らないようにした方がよさそう。

開発体験が良かったのでゆるゆるとRustの学習は続けていきたい。

## おまけ
テスト実行に [https://github.com/nextest-rs/nextest](nextest-rs/nextest) を使ってみたがテスト結果が見やすくて便利だった。

`cargo run`の結果
<img width="1067" alt="cargo nextest run" src="https://user-images.githubusercontent.com/49891479/228600142-5a0bf96a-da2a-4dee-b23a-2b95b16d3c5e.png">

`cargo nextest run`の結果
カラフルで見やすい。
<img width="1020" alt="cargo run" src="https://user-images.githubusercontent.com/49891479/228600091-467eb178-1471-41a9-ae8e-a52ed17efa1c.png">

