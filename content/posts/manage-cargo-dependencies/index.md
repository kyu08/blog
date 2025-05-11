---
title: "cargoプロジェクトで依存関係を継続的に管理する"
tags: ["cargo", "rust", "OSS"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2025-05-11T14:22:40+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

<!-- TODO: カッコの中が微妙なのでなおす -->
OSSに依存するプロジェクトでは依存しているライブラリのライセンス表記が必要なことがある。（というかほとんどのライブラリはライセンス表記を求めるように思う）

そのため、依存ライブラリが増えた場合にはライセンス表記を更新する必要があるが、依存ライブラリの依存ライブラリに対しても再帰的にライセンス表記を見に行って自リポジトリの依存ライセンス表記を更新して...というのを行うのは現実的ではない。

他にもうっかりコピーレフトなライブラリに依存してしまうとプロジェクトのライセンスを変更しなければならなかったりと案外気をつける必要があるポイントが多い。

Rustコミュニティにはこれらの労力を削減してくれるツールがいくつか存在していたので紹介する。

## tl;dr
以下のチェックをCIで実行することでcargoプロジェクトの依存関係を継続的に省力で管理することができる。

- [`cargo-machete`](https://github.com/bnjbvr/cargo-machete)で不要な依存関係がないか
- [`cargo-deny`](https://github.com/EmbarkStudios/cargo-deny)で依存ライブラリに許容しないライセンスが含まれていないか
- [`cargo-about`](https://github.com/EmbarkStudios/cargo-about)で依存ライブラリのライセンス表記が最新か
