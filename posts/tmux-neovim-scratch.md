---
title: 'Tmux+NeovimでJetBrains IDEのScratchみたいな機能を実現している話'
publishedAt: '2023-02-04'
tags: ['開発環境', 'ターミナル', 'zsh', 'cli', 'Neovim', 'Tmux']
---

任意の構成のSandbox的な環境をTmuxのwindowとして用意するようにしたところターミナルから出ずにサクっと動作検証とかが行えてハッピーになったよ、という記事。ここではvanillaなGoのプロジェクトの例を紹介しますが、お好みの構成でSandbox環境を作ってみてください。

全然大したことをやっているわけではないですがTmux, Neovimやそれらのプラグインの普及活動になれば嬉しいので書いてみます。

## 動作イメージ
こんな感じでvanillaのGoプロジェクトをTmuxのwindowに開いておいて、確認したくなったときにすぐwindowを切り替えてコードを書いて実行結果を確認できるようにしている。(Gifの例はGoの書式指定子`%+v`の動作を忘れて試してみているところ)

![go-playground](https://user-images.githubusercontent.com/49891479/216776240-de8145cd-7d07-4351-9aad-587bb7711ec2.gif)

Gifでやっていることは以下

1. GoのSandbox環境を開いたNeovimが起動しているwindowに切り替え
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

基本的に`main.go`の中身を編集して、`go run .`で実行して実行結果を確認するということをしている。

`Makefile`の中身は以下のような感じになっていて、`make run`でコード実行、`make clear`で`main.go`をまっさらにできるようにしているだけである。

```Makefile
.PHONY: run clear

run:
  @go run .

clear:
  @cp ./main.go.sample ./main.go
```

`main.go.sample`の内容は以下。

```go
package main

func main() {
}
```

あとはよく見返したくなるコードは`main.go`以外のファイル名で保存したり、commitしておくと後からでもさっと確認できてよさそう。(筆者はそこまでやってない)

## 感想
ターミナルから出ずに作業が完結できてうれしい。

同様のことはGoの場合はブラウザからThe Go Playground(※)を開いても行えるが筆者は何でもターミナルでできると嬉しい人なのでできるようにしてみた。

※ブラウザ上で実行できるGoのエディタ + 実行環境がセットになったやつ。[https://go.dev/play/](https://go.dev/play/)

あとやるとしたらThe Go PlaygroundにあるURL発行機能とかを実現できると他の人への共有も楽になっていいのかもしれない。(今のところあんまり他の人に共有する機会がないので困っていない)

以上です。
