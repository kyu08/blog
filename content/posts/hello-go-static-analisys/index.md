---
title: "Goの静的解析に入門した"
tags: ["Go", "静的解析"]
keywords: ["Go", "静的解析"]

description: ""
date: 2023-07-17T14:21:29+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

[tenntenn Conference 2023 にスポンサーし、Goの静的解析を完全に理解した話](https://zenn.dev/team_soda/articles/8e61219eab0fc8) を読んでから静的解析が気になっていたのでこれをやってみた。

[静的解析をはじめよう - Gopherをさがせ！](https://golangtokyo.github.io/codelab/find-gophers/?index=codelab#0)

以下のようなソースコードから`Gopher`型を探し出す簡単な解析スクリプトを通してGoでの静的解析の流れやASTの探索方法、型チェックを用いたより詳細な解析方法などを学べた。

> ```go
> package main
> 
> import (
>         "fmt"
> )
> 
> type Gopher struct { // ここ
>         Gopher string `json:"gopher"`
> }
> 
> func main() {
>         const gopher = "GOPHER"
>         gogopher := GOPHER()
>         gogopher.Gopher = gopher
>         fmt.Println(gogopher)
> }
> 
> func GOPHER() (gopher *Gopher) { // ここ
>         gopher = &Gopher{Gopher: "gopher"} // ここ
>         return
> }
> ```
> 
> https://golangtokyo.github.io/codelab/find-gophers/?index=codelab#2 より

解説がかなり丁寧でわかりやすかったので静的解析初心者にはかなりありがたかった。

静的解析を使えば単なる`grep`ではできないことができるイメージが実際に掴めたので早速linterを作ってみようと思う。
