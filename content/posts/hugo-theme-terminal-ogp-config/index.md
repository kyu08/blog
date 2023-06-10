---
title: "hugo-theme-terminal でOGPに任意の画像を設定する方法"
tags: ["hugo", "blog"]
keywords: ["hugo", "blog"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2023-06-10T02:02:33+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: true
color: ""
---

[hugo-theme-terminal](https://github.com/panr/hugo-theme-terminal) でOGPの設定に少し詰まったのでやったことを書いておく。

## 前提
- hugo version: `hugo v0.112.5+extended darwin/arm64`

## 困り
- 筆者はカバー画像を記事一覧・記事詳細画面に表示したくない、かつOGPは全共通の画像を使いたい
- hugo-theme-terminal では任意の画像をOGPだけに設定することができない。（カバー画像をOGPとすることはできる）

## やったこと
多少ハッキーな方法ではあるが以下の方法で実現した。

- 各記事のFront Matterに`cover: "${OGP_URL}"`指定(`archetypes`にテンプレートとして書いておくと便利)
- 以下のCSSを追加
```css
.post-cover {
  display: none;
}
```
