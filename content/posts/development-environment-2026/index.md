---
title: "開発環境現状確認 2026"
tags:
  - 開発環境
  - ターミナル
  - neovim
  - cli
  - tui

description: ""
date: 2026-02-11T20:55:08+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---


2026年年始に複数の方（や会社）が開発環境について書いていたので2026年時点のスナップショットも兼ねて自分も流行りに乗って書いてみる。

https://blog-dry.com/entry/2026/01/02/145952

https://k0kubun.hatenablog.com/entry/development-environment-2026

https://tech.pepabo.com/2026/01/23/development-environment-2026/ [^1]

それではやっていきます。

## OS
大学生くらいからmacOSを使っている。あまり不満がなくて好き。（仕事用端末もmacOS）

唯一あるとしたらゲームがあんまりできないのでこれがちょっとだけ気になっている。

https://store.steampowered.com/sale/steammachine

（厳密にはOSの話ではないが）5年くらい前に買ったM1 MacBook Airの物持ちが良すぎて新しいMacを買うタイミングがなかなか来ない。新しいMacを買うのは楽しいので買いたい気持ちもありつついかんせん困ってないのでなあ...の気持ち。

## エディタ
（就職した）2021年くらいからNeovimを使っている。厳密には2022年ごろまではJetBrains系のエディタと併用していたが、そこからはNeovimのみを使っている。

キーボードだけで操作しやすいのと起動が早いのとカスタマイズしやすいのが好きでつかっている。（もちろんvimの操作性も気に入っている）

AI時代になって設定を自分好みにするコストが格段に減ったのでNeovimのカスタマイズが捗っており嬉しい。（luaの書き方を覚える前にAI時代が来てしまった...）

少し前にこの記事を参考にして起動を高速化したりした。（最近は測ってないが多分今も30msくらいで起動するはず）

<!-- TODO: neovimまわりはもうちょい書くことありそう? -->
<!-- TODO: スクショを貼る？ -->

## AIツール
ClaudeとDevinを使っている。

ClaudeはDesktop App経由で壁打ちや検索用途で使ったり、Claude Codeでコードを書いてもらったりしている。

Claude Codeを使うときはNeovim plugin等ではなくtmuxのpaneを切ってそこで直接動かしている。

Devinは主にAsk Devinを使ってコードベースの調査などに使っている。

## ターミナルエミュレータ
Alacrittyを使っている。ターミナルにはタブがない方がcmd+wで誤爆したりとかが起きないので好きで使っている。正直早いかどうかはあまりわかってないが特に不満もない。

https://github.com/alacritty/alacritty

## ターミナルマルチプレクサ
tmuxを使っている。1セッションに好きなだけウィンドウを開く運用で使っている。

tmux-fzfでのwindow切り替えが快適すぎて手放せない。（動作イメージとか設定手順は過去にこちらに書いた。）

https://blog.kyu08.com/posts/tmux-fzf-window/

<!-- TODO: gifを貼る？ -->

前述の通りalacrittyとの相性がいい感じなのでよほどのことがない限りこの組み合わせは変えなさそう。[^2]

Zellijも試したことはあるが、自分の環境だとなぜか表示が崩れてしまうので使っていない。

https://github.com/zellij-org/zellij

## シェル
zshを使っている。

元々はネットに落ちているshellのコードが（fishよりも）動きやすいから、という理由で使っていたのを惰性で使っている。

少し前にこの記事を参考にして起動を高速化したりした。（最近は測ってないが多分今も数10msくらいで起動するはず）

https://zenn.dev/fuzmare/articles/zsh-plugin-manager-cache

2024/4頃からzeno.zshを使っていてかなりよく使うコマンドの入力が効率化できた。snippetがいい感じに展開されるのは言わずもがな嬉しいが、`zeno-insert-snippet`でzenoに登録したsnippetをfzfで選択&挿入できるのがとても便利。設定ファイルはまだyaml形式で書いている。

https://github.com/yuki-yano/zeno.zsh


<!-- TODO: これもまだ書けることありそう -->

## ランチャー
AlfredとRaycastを併用している。

基本的に不満がないかつ操作性がRaycastよりも好みなので基本的にはAlfredを使っている。

使い道は至って普通でスニペットやweb検索、ローカルのファイル検索などに使っている。あとはWorkflowを利用してよく使うアプリを以下のようなキーバインドで呼び出せるように設定している。

- Alacritty: `opt + space`
- Brave: `cmd + esc`
- Slack: `opt + opt`
- Notion: `opt + n`
- Claude: `opt + x`
- TickTick: `opt + t`
- Spotify: `ctrl + esc`

今は治ってるかもしれないが、一時期Alfredのクリップボードの動作がとてつもなく重くなってしまったのでそこだけRaycastを使っている。

## ウィンドウマネージャー
## フォント
## タスク管理
## ブラウザ
## IME
## CLI/TUIツール
## キーリマッパー
## キーボード
## その他
- fuwari

[^1]: これ系の記事でNeovimの使用率が1位になってるの初めて見た。Neovimユーザーとしては嬉しい。
[^2]: 画面内の文字を検索するのにcmd+fをよく使うのでghosttyは自分には合わなかった。

