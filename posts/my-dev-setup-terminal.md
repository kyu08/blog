---
title: '[タイトル仮]開発効率化のためにやっていること ターミナル編'
publishedAt: '2022-12-15'
tags: [開発環境, ターミナル, zsh, cli]
---

【この記事は[Unipos Advent Calendar 2022](https://qiita.com/advent-calendar/2022/unipos)の記事です】

この記事では筆者が開発の効率化のために行っている工夫や使っているツールなどについて紹介します。
「他にもこんなツールあるよ！」「こんな設定おすすめだよ！」などなどありましたらtwitterとかで教えてもらえると助かります。

今回はターミナル編です！

### ターミナルエミュレータ
筆者はターミナルエミュレータ(以下ターミナル)としてAlacrittyを使っています。

[https://github.com/alacritty/alacritty](https://github.com/alacritty/alacritty)

筆者は普段開発にNeovimを利用しているのですが、以前からプロジェクトの全文検索に時間がかかってしまう点が気になっていました。
動作が高速なターミナルを探していたところRust製のターミナルであるAlacrittyにたどり着きました。

iTerm2からの乗り換えでしたが満足できるだけの速度になりました。

カラースキームはTokyo Nightを利用しています。

他にもRust製のターミナルとしてWarp, Weztermなどもありますが筆者の環境ではWarpはNeovimのcolorschemeの反映がうまくできず、Weztermは画面の再描画まわりの不具合が多少あったため、不採用となりました。(Warp便利そうだしみやすいので使いたかった)

ちなみにAlacrittyにはタブ機能がないのでtmuxなどのターミナルマルチプレクサを利用する必要があります。軽く調べた感じtmuxがデファクトスタンダードっぽかったので筆者はtmuxを使うことにしました。
設定・プラグインなどは後述しますが、tmuxの操作感も好みなので割と満足しています。

### ターミナルのウィンドウ・タブ管理
前述の通りAlacrittyにはタブ機能がないため、ターミナルのウィンドウ・タブ管理にtmuxを利用しています。

[https://github.com/tmux/tmux](https://github.com/tmux/tmux)

筆者の

- 設定
- fzf
- セッション復旧

画像はgithub contentとしてuploadしてimgタグでURL指定するのがとりあえず楽そう

### シェル
- zshを使っています
- alias
  - memo zsh

### ディレクトリ移動
- cdr

### コマンド履歴検索
- c-r

### git操作
- lazygit

## 別のxxx編
- neovim
- alfred
- chrome拡張機能
