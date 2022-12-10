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

Alacrittyにはタブ機能がなくタブ的な機能を実現するためにはtmuxなどのターミナルマルチプレクサを利用する必要があるため筆者はtmuxを利用しています。
設定・プラグインなどは後述しますが、tmuxの操作感も好みなので割と満足しています。

他にもRust製のターミナルとしてWarp, Weztermなどがありますが筆者の環境ではWarpはNeovimのcolorschemeの反映がうまくできず、Weztermは画面の再描画まわりの不具合が多少あったため、採用しませんでした。(Warp便利そうだしみやすいので使いたかった)

## ターミナルのタブ管理
前述の通りAlacrittyにはタブ機能がないため、tmuxを使ってターミナルのタブ管理を行っています。

[https://github.com/tmux/tmux](https://github.com/tmux/tmux)

### ステータスラインの表示
ステータスラインは比較的シンプルにしていて、
- ウィンドウ一覧
- 現在時刻

を表示するようにしています。

<img src="https://user-images.githubusercontent.com/49891479/205433394-8a07f989-5aef-4644-bd3a-63110f9d76ef.png">

普段の開発ではプロジェクトごとにウィンドウを開き、必要に応じて切り替える運用にしています。

### ウィンドウの切り替え
弊社のバックエンド開発ではマイクロサービスを採用しておりさらにmemo用のウィンドウ・dotfiles用のウィンドウなども開いているので常時ウィンドウが15前後あります。筆者は簡単なタスク管理もmemo用ウィンドウに立ち上げたNeovim内で行っているため、ウィンドウの切り替えを頻繁に行います。

以前まではウィンドウ切り替えを
1. `prefix + w` でウィンドウの一覧を表示
1. 目的のウィンドウまで `ctrl + n`, `ctrl + p` で移動
1. 選択する

という手順で行っていましたがウィンドウが増えてくると地味にウィンドウ移動が大変になっていきました。

![従来のウィンドウ切り替え](https://user-images.githubusercontent.com/49891479/205475645-a6aa205d-2733-4764-9387-4988364b86ed.gif)

どうにかファジーファインダーを使ってウィンドウ切り替えができないかと探していたところsainnhe/tmux-fzfに出会いました。

[https://github.com/sainnhe/tmux-fzf](https://github.com/sainnhe/tmux-fzf)

sainnhe/tmux-fzfはファジーファインダーで効率的にtmuxを操作するためのプラグインです。

詳しくはリポジトリのREADMEに譲りますが、
- セッション管理
- ウィンドウ管理
- ペイン管理
- コマンドの検索

などが可能です。

筆者はウィンドウ管理機能の中のウィンドウの切り替え機能を使っています。
sainnhe/tmux-fzf を使うようにしたことでウィンドウ切り替えを
1. `prefix + t` `prefix + t`  でtmux-fzfのウィンドウ一覧を表示
1. 目的のウィンドウ名の一部を入力
1. 選択する

という手順でできるようになりました。文字にすると違いが伝わりづらいですが、キーのタイプ数や切り替えの際の脳の負荷を大幅に減らすことができました。

![sainnhe/tmux-fzfを利用したウィンドウ切り替え](https://user-images.githubusercontent.com/49891479/205475738-0d213f29-c217-4f90-97b9-8ce082b88a9a.gif)

<!-- 設定まで書くか迷い -->

<!-- ### セッション自動復旧 -->
<!-- これ優先順位低いのでもしかしたら書くかもという感じ -->

## シェル
シェルはzshを使っています。 一時期fishも使っていましたが、環境移行のコストが低かったりPOSIX準拠だったりするメリットに旨味を感じてzshに乗り換えました。

### よく使うalias
zshでは`alias hoge='echo hoge'`のように記述することでaliasを定義することができます。

ここでは筆者がよく使うaliasをいくつか紹介します。

```zsh
alias m='cd ~/code/memo; FILE=~/code/memo/$(date +%Y%m%d).md; if [ ! -e $FILE ]; then echo "# todo \n\n# done\n" >> $FILE; fi; nvim $FILE'
```
日毎に`yyyymmdd.md`形式の名前のファイルを作成してvimで開く。
ファイルが存在していなければ
```md
# todo

# done

```
を記入した上でvimで開く、という内容のワンライナーです。

実際に呼び出すとこんな感じです。

![](https://user-images.githubusercontent.com/49891479/206851138-04c447bd-3015-4f40-b315-0980b5ac715c.gif)

ちなみに筆者は

```md
# todo
- タスクA
  - 子タスクa
  - 子タスクb
- タスクB

# done
```
のような感じでタスクを書いていき、完了したら以下のように`done`に移すという素朴な方法でタスク管理をしています。
```md
# todo
- タスクB

# done
- タスクA
  - 子タスクa
  - 子タスクb
```

```zsh
alias ghw='gh repo view -w'
```
`gh`コマンドを利用して現在いるリポジトリをブラウザでGitHubで開くコマンド

![a](https://user-images.githubusercontent.com/49891479/205504551-a201f727-61fe-4c28-a7dd-f9c7c11e0a49.gif)

```zsh
alias pbc='pbcopy && pbpaste'
```
`make test | pbc`のように出力をパイプで`pbc`に渡すとクリップボードにコピーしつつ標準出力に出力してくれる。

コマンドの出力をコピーしたいけど出力内容もその場で確認したいときに便利。

こちらの記事で紹介されていた。

[https://takuya-1st.hatenablog.jp/entry/2017/05/30/093000](https://takuya-1st.hatenablog.jp/entry/2017/05/30/093000)

```zsh
alias finder='open -a Finder ./'
```
現在いるディレクトをfinderで開くコマンド

ごく稀に使う。

<!-- - abbrの紹介 あとまわし-->

### ディレクトリ移動
zshにはcdrという、移動したことがあるディレクトリを自動的に保持してくれる機能があります。

これをいい感じにファジーファインダーから呼び出すスクリプトを公開して下さっている方がいたのでありがたく使わせてもらっています。

[https://www.rasukarusan.com/entry/2018/08/14/083000](https://www.rasukarusan.com/entry/2018/08/14/083000)

これを実際に使うとこんな感じになります。ファジーファインダーを利用して効率的にディレクトリ移動することができます。

![](https://user-images.githubusercontent.com/49891479/205506213-aa3a4752-ad70-4f7d-812f-2ce719cecd30.gif)

やっていることは以下です。

1. .zshrcに定義したfzf-cdrを実行
1. 移動したいディレクトリのパスの一部を入力
1. 候補から移動したいディレクトリを選択する

### コマンド履歴検索
実行したコマンドの履歴についてもfzfを使って絞り込みを行うようにしています。

これもスクリプトを公開して下さっている方がいたのでありがたく使わせてもらっています。

[https://techblog.sgr-ksmt.dev/2016/12/10/smart_fzf_history/](https://techblog.sgr-ksmt.dev/2016/12/10/smart_fzf_history/)

以下のスクリプトを`.zshrc`に記述すると、`ctrl + r`でコマンド履歴を呼び出すことができます。
```zsh
function select-history() {
  BUFFER=$(history -n -r 1 | fzf --no-sort +m --query "$LBUFFER" --prompt="History > ")
  CURSOR=$#BUFFER
}
zle -N select-history
bindkey '^r' select-history
```

![](https://user-images.githubusercontent.com/49891479/206848128-e8a055ff-9f28-4ada-9769-2a5a75195573.gif)

## git操作
git操作のほとんどはgitのTUIクライアントであるLazygitを使っています。

[https://github.com/jesseduffield/lazygit](https://github.com/jesseduffield/lazygit)

## 別のxxx編
- neovim
- alfred
- chrome拡張機能
