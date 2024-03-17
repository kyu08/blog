---
title: "GitHub Issuesをサイトのコメント欄として活用できるutterancesをこのブログに導入した"
tags: ["blog"]
keywords: ["blog", "utterances"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-03-17T22:06:40+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

このブログにコメント欄を設置した。

[utterance/utterances](https://github.com/utterance/utterances)というGitHubのIssuesへのコメントを記事のコメント欄として使えるようにしてくれるOSSのツールを使っている。[^1]

導入に必要だったのは

1. コメント用のリポジトリ作成[^2]
1. [https://utteranc.es/](https://utteranc.es/)でscriptタグを生成
1. 生成したタグをブログに埋め込む

だけだったので10分くらいでできて大変お手軽だった。

(自分はこのブログのリポジトリのissueをコメント用に使いたくなかったのでそれ用のリポジトリを作成したが、もし既存のリポジトリを使う場合は`1.`は不要)

ぜひご自由にコメントを残していってください。

[^1]: [https://blog.orhun.dev/](https://blog.orhun.dev/)で使われていていいなと思ったのでこのブログでも導入してみた。
[^2]: [https://github.com/kyu08/blog-comments](https://github.com/kyu08/blog-comments)
