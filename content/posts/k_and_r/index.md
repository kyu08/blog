---
title: "『プログラミング言語C 第2版 ANSI規格準拠』を読んだ"
tags:
  - "CS"
  - "C"
  - "読書ログ"

description: ""
date: 2026-04-12T17:48:08+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

<!-- TODO: 写真はる -->

[Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)(以下、[OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/))に取り組むにあたって、C言語の知識があるとスムーズそうだったので読んだ。

https://www.kyoritsu-pub.co.jp/book/b10011596.html

Cに関してはCS50で基本的な文法を学んだ程度であまり体系的には学んでいなかったので、CS50の内容を補完するような感じで読んだ。

https://blog.kyu08.com/posts/cs50-jp/

## どんな本か
C言語の開発者であるB.W.カーニハンとD.M.リッチーによるC言語の解説書。

1989/06/15発売と、約40年前の本だが入門書としての評価が未だに高いようだったので買ってみた。(結果的にも普通に勉強になったので良かった)

二人のイニシャルをとってK&Rと呼ばれることもあるらしい。

ちなみに、

> 1.1 Getting Started に、例として掲載されている"hello, world"プログラムは、あらゆる「プログラミングの最初の例題」として定番となった。
>
> https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E8%A8%80%E8%AA%9EC

とあるように、`hello, world`の生みの親としても有名らしい。（！）

各章に演習問題が豊富に用意されているので手を動かしながら学びやすかった。

また、付録を除くと231ページと比較的コンパクトなので、Cの全体像をざっと把握するのにちょうどいいボリューム感だった。

## 読み方
- 1,2章は演習問題をやりつつ読み、他の章は演習問題をスキップして本文だけ読んだ。
    - Cを完全理解したり人に教えられるレベルになりたい、というよりは[OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)での実装がスムーズになれば嬉しいなーくらいの温度感だったのと、手を動かすのは[OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)でできそうだったので知らない文法や仕組みを軽く頭に入れておくくらいの感じで読んだ。
- `#include`なしでboolが使えると多少楽そうだったのでC23で動かした。
    - 演習問題を解いた実装はこちら。

https://github.com/kyu08/sunaba/tree/d15fb4fa20d3e478cc0f5ac6f9e89e7d0c668b21/c/k_and_r

## 学び
- 変数、関数の可視性の制御方法(`static`、`extern`)
- `#include`の機能(`"foo.h"`と`<foo.h>`の違いなど)
- aが配列のとき`a[i]`と`*(a + i)`は同じ
- 共用体
    - 結構使うのが難しそうなので相当パフォーマンスを重視したいときにしか使わないかも...?
- 関数ポインタ
- マクロの基礎

## まとめ
ということで[OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/)に取り組む準備ができたので次は実際に着手していこうと思う。
