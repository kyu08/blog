---
title: "『コンセプトから理解するRust』を読んだ"
tags:
  - "rust"
  - "読書ログ"

description: ""
date: 2025-12-15T19:21:35+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

Rustのことをもっと理解りたくて『コンセプトから理解するRust』を読んだ。

https://gihyo.jp/book/2022/978-4-297-12562-2

## 前提
筆者のRustの知識は[Tour of Rust](https://tourofrust.com/00_ja.html)や[The Rust Programming Language](https://doc.rust-jp.rs/book-ja/)を読んだり簡単なツール[^1]を作ったことがある程度で、非同期処理をスラスラ書けたり、スムーズに人に教えたりできるレベルではない。

[The Rust Programming Language](https://doc.rust-jp.rs/book-ja/)もスマートポインターまわりなどを飛ばしつつ読んでいたので本書での学びは多かった。

## 学び
- `Box`について理解した。
- `Rc`, `RefCell`, `Weak`周りをなんとなく理解した。たぶん空では書けないが、エラーになったら調べて解決できるくらいの理解にはなったはず。
- トレイト境界についてちょっとわかった。
- クロージャ, `Fn`, `FnMut`, `FnOnce`について理解できた。
- 簡単な非同期処理の仕組みがわかった。

今まで全然わかっていなかったこれらの概念が少しだけわかった。やはりコードを書き散らかすだけでなく体系的なインプットは大事...。（それはそう）[^2]

全体を通してコード例が豊富だったので手元で動かしながら理解しやすくてとてもありがたかった。

## まとめ
Rustの力がまた少しついた。（間違ってもﾁｮｯﾄﾜｶﾙとか言えない）

Rustを学ぶとRust自体への理解が深まるだけでなく、少なからずコンピュータの仕組みに近い低レイヤな部分の理解も一緒に深まるので勉強になる感覚があって楽しい、という感覚を改めて感じた。

非同期処理周りはあまりちゃんと勉強したことがないので次はこの本を読んでみようと思う。（サンプルコードが主にRustで書かれているらしいのでこの本での学びも活かせそう）[^3]

https://www.oreilly.co.jp//books/9784873119595/

## おまけ

> The name "Tokio" is derived from Tokyo and mio, and the Tokio logo vaguely resembles the city emblem of Tokyo.
> 
> https://en.wikipedia.org/wiki/Tokio_(software)

Rustの非同期ランタイムのtokioの名前の由来の一部は東京らしい。

あとロゴも東京都の紋章を彷彿とさせるデザインになっているらしい。（実際調べてみたら似ているというかほぼ同じだったw）

[^1]: [fzf-make](https://github.com/kyu08/fzf-make)というTUIツールを書いている。あとそういえば[nand2tetris](https://github.com/kyu08/sunaba/tree/main/rust/nand2tetris)もRustで書いていた。
[^2]: 趣味のプログラミングなのでRustを覚え始めた頃は楽しさ優先でまあ動けばOKという気持ちで書いていたが最近になってちゃんと理解したくなってきたので学んでいる。
[^3]: [詳解 Rustアトミック操作とロック](https://www.oreilly.co.jp/books/9784814400515/)、[Async Rust
](https://www.oreilly.co.jp/books/9784814401185/)、[RustによるWebアプリケーション開発　設計からリリース・運用まで
](https://www.kodansha.co.jp/book/products/0000398182)あたりもとても気になっている。
