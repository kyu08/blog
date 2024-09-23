---
title: "Cloud Run について知らなかったことを書く"
tags: ["Google Cloud", "Cloud Run"]
keywords: ["Google Cloud", "Cloud Run"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-09-23T10:44:54+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

普段業務でCloud Runを使っているが、雰囲気で使っている自覚が大いにあるのでドキュメントやブログを読んで知らなかったことを自分用のメモとしてまとめてみる。

## [](https://cloud.google.com/run/docs/container-contract?hl=ja)

Cloud Run サービスの場合、インスタンスは起動後 4 分以内にリクエストをリッスンする必要があります。また、インスタンス内のすべてのコンテナが良好な状態である必要があります。この起動時間でインスタンスに CPU が割り当てられます。起動時の CPU ブーストを有効にすることで、インスタンスの起動時に一時的に CPU 割り当てを増やして起動レイテンシを短縮できます。
