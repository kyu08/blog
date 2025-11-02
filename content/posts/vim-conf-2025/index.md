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
        - 直接あったこともない人をrepositoryに招待するのは危険だと感じた(サプライチェーンアタックも怖い)
            - 実際に自分のプラグインのコピープラグインができて、そこにマルウェアが含まれていた
        - オンボーディングを頑張るのも大変
- とはいえOSS開発は楽しい
    - nvim-cmpを公開して「これめっちゃ便利だね！」といってもらえたのはとても印象に残っている
    - 意図せず人気になってしまうと責任も生じる

## And Yet, Vim Survived: Thinking and Seeing in the Age of Code You Don't Write
- ありすえさん発表うますぎる
    - 論理構成が自然で理解しやすかった
    - 話す速度、スライドの内容量も適度だったのでついていきやすかった
    - 滑舌が良かった
    - ユーモアを交えていて楽しかった

### Seeing Code: Where, What and Why
- Where - Seeing the flow
- What - Seeing the structur
- Why - Seeing the Reasoning

### Where - Seeing the Flow
- File Jumps
    - gf / gF - open file under cursor
- Search Jumps
    - /や?で検索しnでジャンプ
- fall.nvim
    - 検索で飛ぶのに比べてc-oで前の位置に戻れるので便利
- Quickfix
    - ]q /[qでジャンプできる]

### What - Seeing the structur
- Window management
    - c-w s,v,hjkl
    - c-w o
        - nativeだと元の状態に戻れない
    - Goyoを使うと
        - c-w oをもう一度実行すると戻れる
- file treeは知らないファイルを探すためにつかう
- fuzzy finderは知っているファイルを開くためにつかう

### Why - Seeing the Reasoning
- git blameを活用してコードの背景を理解しながらコードを読む


