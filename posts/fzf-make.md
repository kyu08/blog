---
title: 'Makefileに定義されたtargetをfzfで選択して実行するCLIツールをつくった'
publishedAt: '2023-03-12'
tags: ['rust', 'cli']
---

## つくったもの
Makefileに定義されたtargetをfzfで選択して実行するCLIツールをつくった。

[https://github.com/kyu08/fzf-bookmark-opener](https://github.com/kyu08/fzf-make)

こんな感じで動く。

![demo](https://user-images.githubusercontent.com/49891479/224536333-9bcdbc31-62a2-440d-87b6-17746d4ef138.gif)

## install 方法
```sh
brew install bat # batをinstallしていない場合
brew tap kyu08/tap
brew install kyu08/tap/fzf-make
```

Makefileのプレビューにbatを使ってシンタックスハイライトを付与しつつコードを表示しているためbatが必要になっている。本当はbatがインストールされていなかったらcatでプレビュー表示とかやりたいが対応できていない。
あと出力がすべて色なしになってしまっているのもやる気が出たらなんとかしたい。(contributeお待ちしております。)

## コードの話

## Rustに対するお気持ち
- 関数型っぽくて大変いい
- 開発体験がいい
  - エラーメッセージが丁寧
- コミュニティのサポート感がすごい

