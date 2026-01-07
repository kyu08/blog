---
title: "『CQRS Documents by Greg Young』を読んだ"
tags:
  - "CQRS"
  - "設計"

description: ""
date: 2026-01-06T23:27:58+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

CQRSに興味があったのでGreg Young氏のCQRS Documentsを読んでみた。

https://cqrs.wordpress.com/wp-content/uploads/2010/11/cqrs_documents.pdf

## CQRSに興味を持ったきっかけ
ドメイン層のメンテナビリティの重要性を感じる中で、ドメイン層は書き込み系の振る舞いだけを担い、読み取り系の責務は別のモジュールに移譲してしまった方がドメイン層をシンプルに保てて良いのではないかと考えるようになった。

それってCQRSってやつじゃね？と思ったのでまずは原典に近いドキュメントを読んでみたくなったので読むことにした。[^1]

ここからはCQRS Documentsの内容をまとめていく。

## 非CQRSアーキテクチャシステムの課題

## CQRS

## イベントソーシング

## 感想

[^1]: 厳密にこのドキュメントが原典であることを確認したわけではない。正確な情報をお持ちの方がいたら教えて下さい。なお、CQRSはBertrand Meyerが提唱した[『Command and Query Separation Principle』](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)にその起源を持つ、という記述がCQRS Documents内にあった。
