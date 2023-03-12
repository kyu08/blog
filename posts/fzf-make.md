---
title: 'Makefileに定義されたtargetをfzfで選択して実行するCLIツールをつくった'
publishedAt: '2023-03-31'
tags: ['rust', 'cli']
---

## つくったもの
Makefileに定義されたtargetをfzfで選択して実行するCLIツールをつくった。

[https://github.com/kyu08/fzf-make](https://github.com/kyu08/fzf-make)

こんな感じで動く。

![demo](https://user-images.githubusercontent.com/49891479/224536333-9bcdbc31-62a2-440d-87b6-17746d4ef138.gif)

## install 方法
```sh
brew install bat
brew tap kyu08/tap
brew install kyu08/tap/fzf-make
```

Makefileのプレビューにbatを使ってシンタックスハイライトを付与しつつコードを表示しているためbatが必要になっている。(brewのFormulaをいい感じに定義すればbatのinstallも同時にできるはずだけど面倒でできてない)
あと出力がすべて色なしになってしまっているのもやる気が出たらなんとかしたい。(contributeお待ちしております。)

## 動機
- Rustが書きたかった。(以上)

最近Rustのやっていきが高まっており、簡単な入門書を1周したので何か作ってみるぞーという機運とMakefileのターゲットをfuzzy-finderで絞り込めたら便利そうだなーという気持ちが重なったのでRustでfzf-makeを作ってみた。 (あとはskimというRustでfuzzy-finderをサクっと実装できるライブラリが存在していたのもかなり大きい。)

## Rustの感想
もともとこういう印象を持っていたので気になっていた。実際に学んでみた印象は次のような感じ。

- 関数型っぽくて大変いい, elmの経験も生きている
- 開発体験がいい
  - エラーメッセージが丁寧
- コミュニティのサポート感がすごい(OSSのガイドとか)

