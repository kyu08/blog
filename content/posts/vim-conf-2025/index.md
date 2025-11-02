---
title: "VimConf 2025 Smallに参加した"
tags: ["勉強会", "vim", "neovim"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2025-11-02T10:07:08+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

<!-- TODO: ここにintroをかく -->
<!-- TODO: ここに写真を貼る -->

## nvim-cmp retrospective: Exploring Completion and Facing FOSS Challenges
hrsh7thさんによる発表。

### Explore Completion
- nvim-cmpのcmpって「シーエムピー」って読むんだ（「コンプ」って読んでた）
- 補完プラグインってめちゃめちゃいろんなケースを考慮して作られているんだな...(全然詳しくないので薄い感想しか出せない)

### FOSS Challenges
- 大きなOSSプロジェクトをメンテすることになったことでの学び
- もともとはユーザーのやりたいことと自分のやりたいことが合致していた。自分がやりたいことをやることで感謝してもらえていた。
    - あるときから自分のやりたいこととユーザーの要望が乖離してきた
    - メンテナ目線
        - コード品質を上げたい
        - 実験的な新機能の追加
    - ユーザー
        - 安定した動作
    - 結果モチベが下がった
    - 予期せずプロジェクトが大きくなって責任が芽生えた
    - モチベが低いならコミュニティ主導にすればいいのでは？
        - 直接あったこともない人をrepositoryに招待するのは危険だと感じた（サプライチェーンアタックも怖い）
            - 実際に自分のプラグインのコピープラグインができて、そこにマルウェアが含まれていた（怖すぎる）
        - 新メンテナのオンボーディングを頑張るのも大変
- とはいえOSS開発は楽しい
    - nvim-cmpを公開して「これめっちゃ便利だね！」といってもらえたのはとても印象に残っている
    - 意図せず人気になってしまうと責任も生じる

## And Yet, Vim Survived: Thinking and Seeing in the Age of Code You Don't Write
ありすえさんが発表がうますぎてその点でも勉強になった。自分がわかりやすいと思ったポイントは以下。

- 論理構成が自然で理解しやすかった
- 話す速度、スライドの情報量も多すぎなかったのでついていきやすかった
- シンプルに滑舌が良かった
- ユーモアを交えていて楽しかった

### Seeing Code: Where, What and Why
- Where - Seeing the flow
- What - Seeing the structur
- Why - Seeing the Reasoning

### Where - Seeing the Flow
- File Jumps
    - `gf` / `gF` - open file under cursor
- Search Jumps
    - `/`や`?`で検索し`n`でジャンプ
- fall.nvim
    - 検索で飛ぶのに比べて`<c-o>`で前の位置に戻れるので便利
- Quickfix
    - `]q` / `[q`でジャンプできる

### What - Seeing the structur
- Window management
    - `<c-w>` + `s`/`v`/`h`/`j`/`k`/`l`
    - `<c-w>` + `o`
        - nativeだと元の状態に戻れない
    - Goyoを使うと
        - `<c-w>` + `o`をもう一度実行すると戻れる
- file treeは知らないファイルを探すためにつかう
- fuzzy finderは知っているファイルを開くためにつかう

### Why - Seeing the Reasoning
- git blameを活用してコードの背景を理解しながらコードを読む

## Beyond Syntax Highlighting: Unlocking the Power of Tree-sitter in Neovim
Sticky scrool by nvim-treesitter-contextよさそう

https://github.com/atusy/treemonkey.nvim
便利そう

tree-sitterもっと深く理解したいなー（tree-sitter-justのメンテをできるようになりたい）

## Designing Repeatable Edits: The Architecture of . in Vim
Satoru Kitaguchiさんによるドットリピートの解説。

便利なプラグインの情報を集めるのも楽しいが、たまにはちゃんとVimの機能を学ぶことでも日々のワークフローを効率化できそうだな〜と思った。

- `.`でリピートできる操作
    - ノーマルモードから始まってバッファを編集し、ノーマルモードに戻ってくる
    - undoツリー上のlast-change nodeを再実行している = 直前の編集チャンクを再適用する
- `daw`, `ci"`などはリピートできる
- Visual modeを含んだ操作などはリピートできない
    - Visual modeでは内部的には選択された文字数や行数しか保持されないため

