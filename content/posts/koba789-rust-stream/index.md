---
title: ""
tags: ["", ""]
keywords: ["", ""]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-01-08T21:02:33+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: true
color: ""
---

<!-- TODO: これうろ覚えなので冒頭あたりを確認する - 所有権、ライフサイクルはメモリの表現にすぎない -->
## 所有権
- 所有権
    - 変数の管理責任
    - 変数が死ぬ時に`free`せよ
    - `String`はlen, cap, pointerをスタックに持ち、実際のデータはヒープに存在する
