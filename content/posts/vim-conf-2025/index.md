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

2025年11月2日（日）にアキバプラザ・アキバホールで開催された[VimConf 2025 Small](https://vimconf.org/2025/ja/)に参加した。

![vim-conf-2025.webp](vim-conf-2025.webp)

こちらはノベルティ。食器とかお箸はたくさんあっても困らないのでありがたい。

- お茶碗
- お箸
- コースター
- 巾着
- お茶

![vim-conf-novelty.webp](vim-conf-novelty.webp)

## nvim-cmp retrospective: Exploring Completion and Facing FOSS Challenges
hrsh7thさんによる発表。

### Explore Completion
- nvim-cmpのcmpって「シーエムピー」って読むんだ（「コンプ」って読んでた）
- 補完プラグインってめちゃめちゃいろんなケースを考慮して作られているんだな...（全然詳しくないので薄い感想しか出てこない）

### FOSS Challenges
- 大きなOSSプロジェクトをメンテすることになったことでの学び
- もともとはユーザーのやりたいことと自分のやりたいことが合致していた。自分がやりたいことをやることで感謝してもらえていた。
    - あるときから自分のやりたいこととユーザーの要望が乖離してきた
        - やりたいこと
            - コード品質を上げたい
            - 実験的な新機能を追加したい
        - ユーザー
            - 安定した動作
    - 結果モチベが下がった
    - 予期せずプロジェクトが大きくなって責任が芽生えた
    - モチベが低いならコミュニティ主導にすればいいのでは？という意見も見るが...
        - 直接話したこともない人をrepositoryに招待するのは危険だと感じた（ユーザー数も多いのでサプライチェーンアタックが怖い）
            - 実際にhrsh7thさんが作ったプラグインのコピープラグインがリリース1週間後にできて、そこにマルウェアが含まれていたことがあるらしい（怖すぎる）
        - 新メンテナのオンボーディングをサポートするのも大変
- とはいえOSS開発は楽しい
    - nvim-cmpを公開して「これめっちゃ便利だね！」といってもらえたのはとても印象に残っている
    - 意図せず人気になってしまうと責任も生じる

## And Yet, Vim Survived: Thinking and Seeing in the Age of Code You Don't Write
Λlisueさんによるコードリーディングに関する発表。

以下の3stepに分けてコードを読んでいる。

- Where - Seeing the flow
- What - Seeing the structure
- Why - Seeing the Reasoning

### Where - Seeing the Flow
- File Jumps
    - `gf` / `gF` - open file under cursor
    - これ知らなかった。`go test`の結果を見て失敗しているファイルに飛ぶときとかに便利そう。
- Search Jumps
    - `/`や`?`で検索し`n`でジャンプ
- fall.nvim
    - 検索で飛ぶのに比べて`<c-o>`で直前の位置に戻れるので便利
- Quickfix
    - `]q` / `[q`でジャンプできる

### What - Seeing the structure
- Window management
    - `<c-w>` + `s`/`v`/`h`/`j`/`k`/`l`
    - `<c-w>` + `o`: （複数ウィンドウを開いているときに実行すると）現在のウィンドウのみを表示する
        - nativeだと元の状態に戻れない
    - goyo.vim[^1]を使うと`<c-w>` + `o`をもう一度実行するともとのウィンドウの状態に戻れる。
- file treeは知らないファイルを探すために使う
- fuzzy finderは知っているファイルを開くために使う

### Why - Seeing the Reasoning
- git blameを活用してコードの背景を理解しながらコードを読む

### 感想
ありすえさんが発表がうますぎてその点でも勉強になった。特にこのあたりのポイントが勉強になった。

- 論理構造が自然で理解しやすかった
- 話す速度、スライドの情報量が多すぎなかったのでついていきやすかった
- シンプルに滑舌が良かった
- ユーモアを交えていて楽しく聞けた

## Beyond Syntax Highlighting: Unlocking the Power of Tree-sitter in Neovim
atusyさんによるtree-sitterに関する発表。

https://github.com/atusy/treemonkey.nvim 便利そう

tree-sitterをもっと深く理解したくなった（[趣味のプロジェクト](https://github.com/kyu08/fzf-make)で[IndianBoy42/tree-sitter-just](https://github.com/IndianBoy42/tree-sitter-just)に依存しているので自分もメンテに参加できるようになりたい）

## Designing Repeatable Edits: The Architecture of . in Vim
Satoru Kitaguchiさんによるドットリピートの解説。

- `.`でリピートできる操作
    - ノーマルモードから始まってバッファを編集し、ノーマルモードに戻ってくる
    - undoツリー上のlast-change nodeを再実行している = 直前の編集チャンクを再適用する
- `daw`, `ci"`などはリピートできる
- Visual modeを含んだ操作などはリピートできない
    - Visual modeでは内部的には選択された文字数や行数しか保持されないため

便利なプラグインの情報を集めるのも楽しいが、たまにはちゃんとVim自体の機能を学んだ方がかえって効率よく日々の操作を効率化できそうだな〜と思った。

## LT
ryoppippiさんの https://github.com/ryoppippi/nvim-in-the-loop がかなり便利そう。

自分のVimの操作履歴を記録し、AIにどのようなキーマップを登録すると無駄な操作を減らせるかを分析させるというものらしい。

## まとめ

TODO: かく

[^1]: おそらくこれ https://github.com/junegunn/goyo.vim
