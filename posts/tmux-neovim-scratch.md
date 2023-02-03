---
title: 'Tmux+NeovimでJetBrains IDEのScratchみたいな機能を実現している話'
publishedAt: '2023-02-04'
tags: ['開発環境', 'ターミナル', 'zsh', 'cli', 'Neovim', 'Tmux']
---

任意の構成のSandbox的な環境をTmuxのwindowとして用意するようにしたところターミナルから出ずにサクっと動作検証とかが行えてハッピーになったよ、という記事。ここではvanillaなGoのプロジェクトの例を紹介しますが、お好みの構成でSandbox環境を作ってみてください。

全然大したことをやっているわけではないですがTmux, Neovimやそれらのプラグインの普及活動になれば嬉しいので書いてみます。

## 動作イメージ
こんな感じでvanillaのGoプロジェクトをTmuxのwindowに開いておいて、確認したくなったときにすぐwindowを切り替えてコードを書いて実行結果を確認できるようにしている。

Gifでやっていることは以下

1. GoのSandbox環境のwindowに切り替え(tmux-fzfを使って素早くwindowを切り替えられるようにしている)
1. `make clear`を実行して`main.go`の内容を`main`関数のみに
1. コードを書く
1. Neovim上でターミナルを表示
1. `make run`を実行してコード実行
1. 結果を確認
1. 元いたwindowに戻る

tmux-fzfなど筆者のターミナル環境については以下参照

[開発の効率化のためにやっていること ターミナル編](https://blog.kyu08.com/posts/my-dev-setup-terminal)

筆者はGoの動作を確認したいことがほとんどなのでこういった構成にしているが、必要に応じてよく使うFWをセットアップした環境を作っておくと便利そう。

## プロジェクトの内容
Go固有の内容もあるので参考程度で。

```bash
├── .git
├── .gitignore
├── go.mod
├── go.sum
├── main.go
├── main.go.sample
├── main_test.go
└── Makefile
```

- main.goとmain_test.go
- Makefileの中身

```Makefile
.PHONY: run clear

run:
  @go run .

clear:
  @cp ./main.go.sample ./main.go
```
- あとはメモっておきたいコードスニペットは別名のファイルとして保存したり、commitしておくと後からでもみれてよさそう

## メリット
ターミナルから出ずに作業が完結できてうれしい

同様のことはGoの場合はブラウザからGo PlayGround(※)を開いても行えるが、筆者は何でもターミナルでできると嬉しい人なのでできるようにした。

※ブラウザ上で実行できるGoのエディタ + 実行環境がセットになったやつ。

[https://go.dev/play/](https://go.dev/play/)

## おわりに
- URL発行機能とかをなんとかしたら他の人への共有も楽になっていいのかもしれない(今のところあんまり他の人に共有する機会がないので困っていない)
- `make clear`とかで初期化できると捗りそう
