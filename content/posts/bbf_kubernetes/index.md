---
title: "『つくって、壊して、直して学ぶ Kubernetes入門』を読んだ"
tags:
  - 読書ログ
  - Kubernetes
  - コンテナ

description: ""
date: 2025-12-08T02:04:41+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

0からKubernetesのキャッチアップがしたくて、高橋 あおいさん著の『つくって、壊して、直して学ぶ Kubernetes入門』を読んだ。

https://www.shoeisha.co.jp/book/detail/9784798183961

## そもそものモチベーション
今年の2月から仕事でKubernetesを使い始めたが、普段はk9sを使ってデプロイが完了したかどうかを確認するくらいでそれ以上高度なことは全然できていなかった。

そんな状態なのでトラブルシューティングや運用を独力で全然できないことに課題感を感じていた。

新しい技術を学ぶときは手を動かしながら学ぶのが好きなのでこの本を手に取ってみた。

## 特徴
> 本書は、Kubernetesの実践的な知識をハンズオン形式で解説する書籍です。本書の特徴は、壊れにくいKubernetesをあえて壊しながら学ぶことで、初心者が挫折しやすいトラブルシューティングの知識や対応力が身に付けられることです。初心者でも、経験者でも、今度こそKubernetesがわかる！
> 
> マンガや図解を多く掲載しているため視覚的に理解したい方にもおすすめです。

という書籍説明の通り、ハンズオン形式でKubernetesを学ぶことができる。

また、[Kind](https://github.com/kubernetes-sigs/kind)というツールを使ってローカルでKubernetesクラスタを構築するのでクラウドの登録や課金を気にする必要がないのも手軽でよかった。

https://github.com/kubernetes-sigs/kind

1つ1つの解説はそこまで文量がないので結構サクサク進めることができる。なので本書でKubernetesの全体感を本書で学び、深く学ぶのは別のリソースで補うのがよさそうだと感じた。[^1]

誤解のないように書いておくと、自分のようなKubernetes初心者にとっては各リソースの説明の文量が多すぎないお陰で短期間で全体感を把握できてとてもよかった。(気になったところは別途公式ドキュメントやLLMを使って深堀ったりした)

こんな雰囲気。漫画があって文量も多すぎず読みやすい。

![manga.webp](manga.webp)
[商品ページ](https://www.shoeisha.co.jp/book/detail/9784798183961)より引用

以下の画像のように実行すべきコマンドとその結果がどうなるかが書いてあるのでKubernetesの経験が少なくても進めやすい。（実際自分もほぼ知識0で臨んだ）

![command.webp](command.webp)
[商品ページ](https://www.shoeisha.co.jp/book/detail/9784798183961)より引用

## 学び
- kubectlの使い方
- Pod、Service、Deploymentなどの基本的なリソースの性質や動かし方
- Readiness probe, Liveness probe, Startup probeの特徴や使い方
- Resource Requests/Limits, HPA, Affinity, HPA, VPAなどの性能やスケールなどに関する機能の使い方
- Kubernetes自体のアーキテクチャ
- etc.

## 感想
- 0からKubernetesの基礎を学ぶことができてとても良い本だった。
- ちょうど業務でmanifestを書くタイミングがあったので本書で学んだことがダイレクトに業務に活きてとても助かった。
- 次はしばらく積んでしまっていた[『体験しながら学ぶ ネットワーク技術入門』](https://www.sbcr.jp/product/4815618599/)をやっていく。

[^1]: 本書後半でも紹介されているが本で詳しく学ぶなら[Kubernetes完全ガイド 第2版](https://book.impress.co.jp/books/1119101148)がいいらしい。
