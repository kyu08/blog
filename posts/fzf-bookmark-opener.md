---
title: 'yamlに定義したbookmarkをfzfで選択してブラウザで開くくんを作った'
publishedAt: '2023-02-23'
tags: ['go', 'cli']
---

# つくったもの
yamlに定義しておいたbookmarkをfzfで選択してブラウザで開くくんを作った。

[https://github.com/kyu08/fzf-bookmark-opener](https://github.com/kyu08/fzf-bookmark-opener)

こんな感じで動く。

![demo](https://user-images.githubusercontent.com/49891479/218272272-e693c10d-c810-458a-bf46-9c3a4a2fe45a.gif)

# コードの話
コード自体は大変シンプルで

1. 設定ファイルがなければ`~/.config/fzf-bookmark-opener/config.yaml`に作成
1. 設定ファイルの読み込み
1. fzfで選択
1. 選択されたブックマークをブラウザで開く

ということをやっているだけである。(`main.go`に120行弱だけという素朴なコード量)

[fzf-bookmark-opener/main.go at main · kyu08/fzf-bookmark-opener](https://github.com/kyu08/fzf-bookmark-opener/blob/69313bf187dcfd6127efcf75e172a34fb9b8e05a/main.go#L38-L60)

この記述量で作れたのは間違いなくktr0731/go-fuzzyfinderのおかげでした。このライブラリのおかげでgoのコードからfzfを簡単に呼び出すことができました。というかなんならこのライブラリの存在を知ったので使ってみたくなってfzf-bookmark-openerを作ったみたいなとこもあります。ありがとうございます。

[ktr0731/go-fuzzyfinder](https://github.com/ktr0731/go-fuzzyfinder)

# ちゃっかりbrewでも公開してみた
brewでインストールできるに越したことはないだろうってことで、brewでも公開してみたが思いのほか簡単だった。

```shell
brew tap kyu08/tap
brew install kyu08/tap/fzf-bookmark-opener
```

これだけでインストールできるので気になった方もそうでない方もぜひ。issueやPRもお待ちしています。(`go install`でインストールしたい方はこちら(`go install github.com/kyu08/fzf-bookmark-opener@latest`))

brew公開に関してはこちらのブログを参考にしたら30分弱でサクッと公開できた(想像より簡単だった)

[https://www.rasukarusan.com/entry/2019/11/03/211338](https://www.rasukarusan.com/entry/2019/11/03/211338)

詳細は↑の記事を読んでいただければわかるが、リリースにバイナリを含めて配布用のrepositoryを作るだけなので本当に簡単だったのでツールを配布したい人はぜひ。

# ちゃっかりヘルパースクリプトも公開した
現在お仕事ではGCPを使っているんですが、GCPのコンソールをプロジェクト、サービスを指定して直接開きたいことが多いのでプロジェクトのリストを渡すとGCPの主要なサービス(主観)のURL一覧をfzf-bookmark-openerの設定ファイルの形式で吐いてくれるスクリプトも公開した。
    
[kyu08/gcp-url-generator](https://github.com/kyu08/gcp-url-generator)

project名のリストとregionを渡すとこういう文字列を吐いてくれるイメージ。(以下は出力の一部)(この例だとregionは関係ない)

```yaml
  - title: 'Home stg'
    url: 'https://console.cloud.google.com/home/dashboard?project=stg'
  - title: 'Home dev'
    url: 'https://console.cloud.google.com/home/dashboard?project=dev'
  - title: 'Home prod'
    url: 'https://console.cloud.google.com/home/dashboard?project=prod'
  - title: 'Datastore stg'
    url: 'https://console.cloud.google.com/datastore/entities?project=stg'
  - title: 'Datastore dev'
    url: 'https://console.cloud.google.com/datastore/entities?project=dev'
  - title: 'Datastore prod'
    url: 'https://console.cloud.google.com/datastore/entities?project=prod'
```

現在の対応サービスは以下で、Cloud Runに関してはサービス名の配列を渡すとプロジェクト*サービスの全組み合わせのURLを吐く。

- Dashboard
- Datastore
- App Engine
- Artifact Registry
- Cloud Storage
- Spanner
- BigQuery
- Cloud Scheduler
- PubSub
- Dataflow
- Cloud Build
- Cloud Tasks
- Cloud Run
- Cloud SQL
- Cloud Functions
- IAM
- Secret Manager
- AI Platform
- Compute Engine
- Logging
- Monitoring
- Workflows
- Firebase Realtime Database (DB)
- Firebase Hosting
- Firebase Remote Config

これで生成したURLをfzf-bookmark-openerに食わせるとお使いのGCPプロジェクトの特定のサービスがコマンドラインからサクッと開くことができる。(詳しくは[kyu08/gcp-url-generatorのREADME](https://github.com/kyu08/gcp-url-generator)を参照)
こちらもissueやPRお待ちしてます。

# 余談1
Rustだとlotabout/skimを使うとktr0731/go-fuzzyfinderと同じようなことができるらしい。最近Rust熱が高まりに高まっている(Tour of Rustやり中)ので次に何かCLIでfzfなツールをつくるときは使ってみようと思う。

[lotabout/skim](https://github.com/lotabout/skim)

# 余談2
ふと気になってktr0731/go-fuzzyfinderをはじめとする依存ライブラリのライセンス表示はどうすればいいか気になって調べてみたところリポジトリに`NOTICES`とか`CREDITS`とか`ThirdPartyNotices`みたいなファイルを置いてそこに依存ライブラリの著作権・ライセンス表示をするのが一般的なようだった。

手作業でやるのは辛いので自動生成ツールを探したところGoだとこれが使いやすそうだったので使ってみたけど簡単でとてもよかった。ありがたや...。

[https://github.com/Songmu/gocredits](https://github.com/Songmu/gocredits)


# まとめ
ktr0731/go-fuzzyfinderはいいぞ〜
