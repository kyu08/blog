---
title: "Gerritで自分が作成したCL一覧を確認する方法"
tags:
  - "Gerrit"

description: ""
date: 2025-12-25T00:17:02+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

年末の振り返りを書いていて自分が作成したCL一覧が見たくなったときに地味に迷ったのでメモしておく。

## tl;dr
以下にアクセスする。

```
<repo-url>/q/owner:<your-email>
```

こんな感じで表示される。

![result.webp](result.webp)

たとえばgoのrepositoryだったら`https://go-review.googlesource.com/q/owner:<your-email>`のような感じ。

以降はおまけ。

## 経緯
ここから行けるか...?とか思ったが...
![menu.webp](menu.webp)

マージ済みが表示されそうな項目はRecently closedしかないが、これだと最近のCLしか見れなさそうだった。
![dashboard.webp](dashboard.webp)

検索ボックスに打ち込むクエリを試行錯誤したところ冒頭の指定方法を見つけた。

GitHubと違ってrepository横断で検索できないっぽいので複数のGerrit repositoryから活動を集計するのは大変そう。（調べてないだけでやり方はあるのかもだが）[^1]

[^1]: GitHubと違ってrepositoryごとにそれぞれでホスティングされてそうな雰囲気を感じるので直感的には難しそうではある。
