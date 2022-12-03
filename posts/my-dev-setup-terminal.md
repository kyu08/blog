---
title: '[タイトル仮]開発効率化のためにやっていること ターミナル編'
publishedAt: '2022-12-15'
tags: [開発環境, ターミナル, zsh, cli]
---

【この記事は[Unipos Advent Calendar 2022](https://qiita.com/advent-calendar/2022/unipos)の記事です】

この記事では筆者が開発の効率化のために行っている工夫や使っているツールなどについて紹介します。
「他にもこんなツールあるよ！」「こんな設定おすすめだよ！」などなどありましたらtwitterとかで教えてもらえると助かります。

今回はターミナル編です！

## ターミナルエミュレータ
筆者はターミナルエミュレータ(以下ターミナル)としてAlacrittyを使っています。

[https://github.com/alacritty/alacritty](https://github.com/alacritty/alacritty)

筆者は普段開発にNeovimを利用しているのですが、以前からプロジェクトの全文検索に時間がかかってしまう点が気になっていました。
動作が高速なターミナルを探していたところRust製のターミナルであるAlacrittyにたどり着きました。

iTerm2からの乗り換えでしたが満足できるだけの速度になりました。**ターミナルの速度を早くしたい人にはオススメ**です。あとは**設定をyamlで記述できる**のも好みなポイントです。

カラースキームはTokyo Nightを利用しています。

<img src="https://user-images.githubusercontent.com/49891479/205432298-5d608837-8ced-4195-83d0-bc61149b7a02.png">

Alacrittyにはタブ機能がないのでtmuxなどのターミナルマルチプレクサを利用する必要があるので、tmuxを利用しています。
設定・プラグインなどは後述しますが、tmuxの操作感も好みなので割と満足しています。

他にもRust製のターミナルとしてWarp, Weztermなどがありますが筆者の環境ではWarpはNeovimのcolorschemeの反映がうまくできず、Weztermは画面の再描画まわりの不具合が多少あったため、不採用となりました。(Warp便利そうだしみやすいので使いたかった)

## ターミナルのタブ管理
前述の通りAlacrittyにはタブ機能がないため、tmuxを使ってターミナルのタブ管理を行っています。

[https://github.com/tmux/tmux](https://github.com/tmux/tmux)

### ステータスラインの表示
ステータスラインは比較的シンプルにしていて、
- ウィンドウ一覧
- 現在時刻
を表示するようにしています。

普段の開発ではマイクロサービスごとにウィンドウを開き、必要に応じて切り替える運用にしています。(memo用のウィンドウ・dotfiles用のウィンドウなども開いているので常時ウィンドウが15前後ある)
<img src="https://user-images.githubusercontent.com/49891479/205433394-8a07f989-5aef-4644-bd3a-63110f9d76ef.png">

### ウィンドウの切り替え
### セッション自動復旧

画像はgithub contentとしてuploadしてimgタグでURL指定するのがとりあえず楽そう

## シェル
- zshを使っています
- alias
  - memo zsh

### ディレクトリ移動
- cdr

### コマンド履歴検索
- c-r

## git操作
- lazygit

## 別のxxx編
- neovim
- alfred
- chrome拡張機能
