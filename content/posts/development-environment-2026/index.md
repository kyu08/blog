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

<!-- TODO: スクショを貼る？ -->

## ターミナルマルチプレクサ
tmuxを使っている。1セッションに好きなだけウィンドウを開く運用で使っている。

tmux-fzfでのwindow切り替えが快適すぎて手放せない。（動作イメージとか設定手順は過去にこちらに書いた。）

https://blog.kyu08.com/posts/tmux-fzf-window/

<!-- TODO: スクショを貼る？ -->

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
yabaiとskhdを使っている。設定をコード管理できるのが嬉しい。たまに動作が不安定になるのでそのたびに`yabai --restart-service && skhd --restart-service`を実行している。とはいえ特に不満もない。

https://github.com/asmvik/yabai

https://github.com/asmvik/skhd

よく使うのはこの辺のやつ。

- windowを右半分に表示
- windowを左半分に表示
- windowを左上に表示
- windowを左下に表示
- windowを右3/4に表示
- windowを左1/4に表示

## フォント
M+1Code Nerd Font Monoを使っている。まるっとしていて好き。nerd fontも入っているのでNeovimを使っていても豆腐があまり出なくて嬉しい。

## タスク管理
ここ1年くらいはnvim-orgmode/orgmodeを使っている。emacsのorg-modeライクな機能をNeovimで使えるようにしたプラグイン。

https://github.com/nvim-orgmode/orgmode

少し前まで素朴にこんな感じのファイルを毎日生成して管理していたが、期日が違うタスクをいい感じに管理したくて使い出した。
```markdown
## TODO
- 実装

## DONE
- コードレビュー
```

Neovimでタスク管理できるのとタスクに優先度、期日を設定してそれをいい感じにソートして表示してくれるのがかなり肌にあっていて気に入っている。

最近は時間の使い方を振り返る目的でClock In的な機能を使ってタスクごとの所要時間も管理してみている。

これに関してはそのうち別の記事として詳しく書きたい。

<!-- TODO: スクショを貼る？ -->

## ブラウザ
数年前からBraveを使っている。広告をブロックしてくれつつChrome拡張も使えるので便利。一時期Arcも使っていたが肌に合わない挙動があったので使うのをやめてしまった。（具体的には覚えていない）

<!-- TODO: chrome拡張の話をかいてもいいかも -->

## IME
Google日本語入力を使っている。

たまーにひらがなの変換がおかしいのが気になっている。

<!-- TODO: azookeyも試したが... -->

## CLI/TUIツール
- lazygit
- k9s
- fzf-make

<!-- TODO: それぞれスクショかgifをはる -->

## キーリマッパー
## キーボード
- 7sPro
- EPOMAKER SPLIT70

<!-- TODO: キースイッチは... -->

## その他
- fuwari

[^1]: これ系の記事でNeovimの使用率が1位になってるの初めて見た。Neovimユーザーとしては嬉しい。
[^2]: 画面内の文字を検索するのにcmd+fをよく使うのでghosttyは自分には合わなかった。
