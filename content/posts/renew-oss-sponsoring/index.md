---
title: "GitHub Sponsorsの寄付先にratatuiを追加した"
tags: ["OSS", "rust", "tui"]
keywords: ["OSS", "rust", "tui"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-09-24T00:02:46+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

[OSSへの寄付の月予算を$10にした - laiso](https://laiso.hatenablog.com/entry/2022/02/25/gihutown)

こちらの記事で寄付するOSSプロジェクトの選び方として次のような基準が紹介されていた。


> 寄付するプロジェクトはこういう基準で選んでる
> 
> - 自分が使っていてなくなったら困る
> - マイナーであまり寄付されていない

今まで前者の基準に則って[neovim](https://github.com/sponsors/neovim)に寄付していたが、後者の観点を持てていなかったことに気付いた。そこで自分もOSSへの寄付を見直してみようと思った。

## というわけで
タイトルの通りだが、GitHub Sponsorsの寄付先に[ratatui](https://github.com/sponsors/ratatui)を追加した。

[ratatui](https://github.com/ratatui/ratatui)とは、手軽にTUIアプリケーションを作成できるRust用のライブラリで、筆者が個人開発しているOSSである[fzf-make](https://github.com/kyu08/fzf-make)でも利用している。[^1]

![fzf-make-demo.gif](https://raw.githubusercontent.com/kyu08/fzf-make/main/static/demo.gif)
[ratatui](https://github.com/ratatui/ratatui)のおかげでこんな感じのUIを手軽に実装できている。

<!-- textlint-disable ja-technical-writing/ja-no-weak-phrase -->
Rust製のTUIツールでは非常に幅広く利用されている印象だが、現在のスポンサー数が9人と少なかったので少しでも力になれればということで寄付先に追加した。長期間メンテされる状態が続いてくれると嬉しい。自分にもできそうなバグ修正があれば挑戦してみようと思う。
<!-- textlint-disable ja-technical-writing/ja-no-weak-phrase -->

![ratatuis-10th-sponsor.webp](ratatuis-10th-sponsor.webp)
10番目のスポンサーになった様子。

これで現在の寄付額は$10/月で、[neovim](https://github.com/sponsors/neovim)と[ratatui](https://github.com/sponsors/ratatui)にそれぞれ$5ずつ寄付していることになる。

![github-sponsors-logos.webp](github-sponsors-logos.webp)

他にも寄付したいプロジェクトは山ほどあるので山ほど稼いでいきたい。(あと円高頼む...)

## まとめ

今後ともOSSコミュニティの持続可能性を高めていきたい。

[^1]: make targetをプレビューウィンドウ付きであいまい検索によって選択&実行できるツール。brewやcargoでインストールできるのでぜひ。 https://github.com/kyu08/fzf-make
