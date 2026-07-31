---
title: ""
tags:
  - ""

description: ""
date: 2026-07-30T10:05:44+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

受付の方の英語がまったく聞き取れず絶望(通訳の方がいたのでなんとかなった)

## スポンサーブース
- microsoft
- datadog
- aws

## Beyond Translation: The Journey of Building the Japanese Kubernetes SIG Docs Community
去年1年で173のprがmergeされた

Localization Guideを見るとどのように貢献を始めるかがわかるようになっている

- Upstream Trainingもあるよ
    - 年に2回やっている

- aoiさんも去年のkube conでの発表をみてkube docへの貢献を始めた

- 始め方
    - 動画をみた（Japanese Community have contes to train yourselfらしい）
    - sample PRを作成した
- よかったこと
    - docをメンテするために深く学習することになる
    - Kubestranautにもなった
- 気づき
    - 仕事と同じでリスペクトや明瞭なコミュニケーションは重要だし、それらがあればスムーズにことが進む


### 感想
<!-- TODO: かく -->

## From User to Contributor: A Quick Guide to kubectl & kustomize
### kubectl
- Legacy
    - kubectlの各コマンドの構造(New, Options, Complete, Validate, Run)
- NewStructure

### 感想
コードの構造がわかると貢献へのハードルが下がるのでめっちゃ良い時間だった。これまで以上に興味も持てたし。

### kustomize


## Repurposing OpenTelemetry Traces as Test Data: Breaking the Cost Barrier in System Migration
<!-- Jul 30 • 14:50-15:20 3F | 315 -->
- システム移行において、どのように新システムが旧システムと同じ挙動であることを保証するか
    - 課題
        - コードが読みづらい
        - 最新の仕様書がない
        - ...
    - 解決策(概要)
        - 本番環境のinput/outputを新システムのテストデータとする
    - どのようにinput/outputを記録するか
        - traceを利用する。
- OBIを使って旧アプリケーションのコードに手を入れずに欲しいデータを入手する
    - eBPFを使ってネットワークパケットをキャプチャする

### 感想
- ちょうど仕事でも移行作業をする予定があったのでとても参考になった。
    - 新旧システムの挙動を外形で比較するという発想はなかった。
- 疑問
    - 多くの場合、APIはDatabaseの中身によってレスポンスが変わると思う。今回紹介された方法でテストのinputと期待値はわかるが、テストを実行するためにはシードデータも必要なはず。個々のテストケースで必要なシードデータはどう特定した？(PoCでは空のデータベースで行ったらしい)
        - CDCを使うことを検討しているが、技術的にもかなり大きな壁になりそう

## OTel meets Wasm: Rethinking OpenTelemetry Collector Extensibility
<!-- Jul 30 • 15:50-16:20 3F | 315 -->

## The Road to Cilium: Migrating 150+ Kubernetes Clusters at Airbnb
<!-- Jul 30 • 16:30-17:00 5F | 502 -->
- Cilium
    - Kubernetes-Native eBPF

## 感想
- 英語モチベが上がった
- もちろん技術モチベ(とくにkube)もあがった
- あとOSSモチベも上がったので翻訳への貢献をやっていきたい
- スポンサーブースでもためになる話を聞くことができた(各種グッズももらえたし)
- いってよかった
