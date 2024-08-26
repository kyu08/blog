---
title: "GitHubで自分がOSSに送ったPR一覧を表示するやつ"
tags: ["GitHub"]
keywords: ["GitHub"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2023-10-22T19:26:39+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

稀に自分がOSSに送ったPR一覧を見たくなるのでメモ代わりに書く。 (正確には「自分所有でないpublic repositoryに送ってマージされたPR一覧」を表示する方法)

## tl;dr
https://github.com/pulls でクエリに

```shell

is:pr archived:false is:closed author:@me is:public -user:@me created:2024-01-01..2024-12-31 

```
を指定して検索するとこんな感じで表示される。

![pulls](pulls.webp)

## 余談
- orgを所属組織とかに絞って検索すれば仕事の振り返りとかにも使えそう。
- 他にも https://github.com/pulls/review-requested にいくと自分がレビュワーとしてアサインされているPR一覧が見れて便利だったりする。ターミナル上で同じようなことをやりたい人は [dlvhdr/gh-dash](https://github.com/dlvhdr/gh-dash) とかもオススメかもしれない。
