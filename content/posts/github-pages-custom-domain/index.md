---
title: "GitHub Pagesでデプロイのたびにカスタムドメインの設定が消える問題の解決方法"
tags: ["GitHub Pages"]
keywords: ["GitHub Pages"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2023-06-10T23:14:42+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

## 困っていたこと
- GitHub Actions経由でGitHub Pagesにデプロイするたびにカスタムドメインの設定が消えてしまい、デプロイ先がカスタムドメインから`https://<username>.github.io/<repository>`に戻ってしまう

## 解決方法
[ドキュメント](https://github.com/peaceiris/actions-gh-pages#%EF%B8%8F-add-cname-file-cname)にある通り、`cname`オプションを追加する必要があった。

```yaml
name: deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: "0.112.5"
          extended: true

      - name: Build
        run: hugo

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          # これが抜けていた
          cname: blog.kyu08.com
```

## まとめ
ドキュメントちゃんと読むの大事
