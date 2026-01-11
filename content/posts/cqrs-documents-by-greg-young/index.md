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

<!-- TODO: `ちなみに`以降を削るか迷い -->
（もちろんアプリケーションの状況にもよるが...。repositoryのRead系メソッドの返り値がドメインモデルと一致しないケースが多くなるようなケースで特にCQRSのメリットが効果を発揮しやすいような気がしている。状況にかかわらずCQRSをやったほうがいいのかどうかはまだあまりわかっていない。ちなみにここでのCQRSは基本的には同一DBでCのアプリケーションコードとQのアプリケーションコードが分離されている、くらいの方法をざっくり想定して書いている。）

それってCQRSってやつじゃね？と思ったのでまずは原典に近いドキュメントを読んでみたくなったので読むことにした。[^1]

ここからはCQRS Documentsの内容をまとめていく。

## 非CQRSアーキテクチャシステムの課題
"A Stereotypical Architecture"として、典型的なアーキテクチャが紹介されている。本Documentsではこのアーキテクチャに対して段階的にCQRSを導入していく形で説明が進んでいく。

![a-stereotypical-architecture.webp](a-stereotypical-architecture.webp)
CQRS Documents by Greg Young P2より引用

このアーキテクチャではシステムはCRUDのみの機能を持ち、クライアントとは常にDTOを介して通信する。

つまり、クライアントは`UpdateUserName`のようなエンドポイントに更新後のユーザーネームだけを渡すのではなく`/user`に更新後のDTOを丸ごと渡す。

サーバー側では受け取ったDTOをドメインオブジェクトに詰め替えてバリデーションを行い、永続化する。

このような設計ではアプリケーションサービスの責務はDTOとドメインオブジェクトの詰め替えに終始し、ドメイン層はバリデーションを主な責務として受け持つ。データの更新方法はクライアントに委ねられてしまうため、ドメイン知識の一部がクライアント側に漏れ出してしまう。（e.g. 会員ランクによる割引率の設定がある場合など）

このようなアーキテクチャでは簡潔性からオンボーディングコストが低くなるメリットがある代わりに、次のような課題が発生する。

1. スケーリング: 一般的なシステムでは読み取り操作は書き込み操作よりも2桁以上多い。読み取り操作目線では非正規化されたデータ構造が適しているが、書き込み操作目線では正規化されたデータ構造が適している。これらを単一のDBで扱おうとすると垂直スケーリングが必要になるが、垂直スケーリングには非常に高額なコストがかかる。
2. DDD適用の困難さ: この設計ではAPIがデータ指向のインターフェースを持つため、システム全体がCRUDの4つの動詞に縛られる。（データの更新方法がクライアントまたはユーザー側に漏れ出ておりドメイン知識をソフトウェアで表現することが難しいため）

### ここまでの感想
さすがにこういったアーキテクチャのシステムは見たことがないので極端な例では...?とは思ったが時代や場所によってはこういった設計のシステムも一定あるのかもしれない。

## CQRS
CQRSはBertrand Meyerが提唱した[『Command and Query Separation Principle』](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation)にその起源を持つ。Wikipediaではこの原則を次のように説明している。

> It states that every method should either be a command that performs an action, or a query that returns data to the caller, but not both.
>
> [Command–query separation - Wikipedia](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation) より引用

とあり、すべてのメソッドはCommandかQueryのいずれかであるべきであり、両方を兼ねるべきではないと説明されている。

これに対し、Martin Fowlerは以下のようにPopのような操作はCommandでありQueryでもあり、必ずしも上記の原則を厳密に守らなくてもいいのではないか、ということを述べている。

> Meyer likes to use command-query separation absolutely, but there are exceptions. Popping a stack is a good example of a modifier that modifies state. Meyer correctly says that you can avoid having this method, but it is a useful idiom. So I prefer to follow this principle when I can, but I'm prepared to break it to get my pop. (Fowler)
>
> CQRS Documents by Greg Young P17より引用

実際にWebサービスも開発していてもたとえばユーザー作成メソッドが作成したユーザーのIDを返すように処理は普通に書くし、自分もどちらかというと定義ほどは厳密に運用しなくても十分恩恵を受けられるのではないかという立場。


## "A Stereotypical Architecture"にCQRSを導入する
"A Stereotypical Architecture"として最初に紹介されたアーキテクチャでは、ドメインモデルがCommandとQueryの両方に使用されていた。

### Query
Query処理側にはデータ取得のためのメソッドのみが含まれる。

元のアーキテクチャではドメインモデルを生成し、それをDTOにマッピングしたうえでクライアントに返却していた。多くの場合でドメインモデルとDTOは異なるモデルであるため、以下のような課題がある。

1. 複数集約から1つのDTOを生成する場合、複数回DBにアクセスする必要がありパフォーマンスが低下する。また、集約の境界が曖昧になる。
1. ドメイン層にQueryの責務が多く含まれている（e.g. repositoryのinterfaceにQuery系のメソッドが多く含まれ、ページングやソート情報が含まれている）

> After CQRS has been applied there is a natural boundary. Separate paths have been made explicit. It makes a lot of sense now to not use the domain to project DTOs. Instead it is possible to introduce a new way of projecting DTOs. 
>
> CQRS Documents by Greg Young P20より引用

とあるように、CQRSを適用することでCommandとQueryの処理経路が明確に分離される。この段階ではドメインモデルをDTOを生成するために使用しない方が合理的である。

その代わりに"Thin Read Layer"という方法でDTOを生成することができる。

![thin-read-layer.webp](thin-read-layer.webp)
CQRS Documents by Greg Young P21より引用

この層はDBから直接データを読み取り（ドメインモデルを迂回し）DTOを生成する。こうすることで、ドメイン層からQueryの責務を切り離すことができ、ドメイン層の純度を上げることができる。

### ここまでの感想
<!-- TODO: view table生成などの責務を追っている例も見たことがある、的な追記をする？ -->

### Command
CQRSを適用するとCommand側のアーキテクチャは以下のようになる。

![the-command-site.webp](the-command-site.webp)
CQRS Documents by Greg Young P22より引用

元のアーキテクチャでは書き込み系の処理をする際もDTOをクライアントから受け取っていたが、CQRS適用後はデータ中心ではなく振る舞い中心の契約を採用している点と読み取り処理が分離されている点が大きな違い。

また、元のアーキテクチャでドメイン層に存在していた次のような課題が解決されている。

1. リポジトリに大量の読み取りメソッドが存在する
1. DTO構築のためにドメインオブジェクトの内部状態を公開するゲッターメソッドが存在する
1. DTO構築のために複数の集約オブジェクトを読み込むことで、データモデルに対する非効率なクエリが発生する

### ここまでの感想
<!-- TODO: かく -->

### ドメインイベント、イベントソーシング
本文にはドメインイベント、イベントソーシングについても記載があり読んだが直近の興味領域的にここを詳しくまとめるだけのモチベーションはないのでスキップする。

## 作業習慣の違い
このDocumentsを読むまでは意識していなかったが、CQRSを採用することで

1. ドメイン層
1. リードモデル
1. クライアント

の3つの要素に分解して作業を進めることができるため、プロジェクトに関わる開発者数をより効果的に増やすことができる。（サーバーとクライアントの作業分担をできるのはCQRSかどうかにかかわらないが重要なのは1つのサーバーアプリケーションを2並列で安全に進めやすいという点だろう。）

また、チームには次のような観点で開発者間には様々な差異が存在し、

1. 技術的熟練度
1. ビジネスドメインに関する知識
1. コスト
1. ソフトスキル

ドメイン層の実装にはコストは高いがビジネス知識が豊富で技術的熟練度も高く、ドメインエキスパートと円滑にコミュニケーションを取れる人材が最適である一方、リードモデルの実装にはそれらの開発者要件は当てはまらない。

## 感想
Documents内でも触れられていたが、結局CQRSにしろイベントソーシングにしろ一定のオーバーヘッドはあるので、システムやビジネスの要件や今後の見通しを元に必要性を検討するのが重要。（それはそう）

というのはありつつ、ドメイン層のメンテナビリティを高めるためにCQRSを採用するのは有効な選択肢の一つだとも感じているので、ひとまず個人のプロジェクトで検証してみたいと思う。

[^1]: 厳密にこのドキュメントが原典であることを確認したわけではない。正確な情報をお持ちの方がいたら教えて下さい。
