---
title: "forkしたrepositoryのremoteを最新化しつつローカルにpullするスクリプトを書いた"
tags: ["GitHub", "cli", "zsh"]
keywords: ["GitHub", "cli", "zsh"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-09-03T00:54:12+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

## tl;dr
```bash
# forkをのremoteを更新しつつ、ローカルリポジトリを最新にする
function git-sync() {
    REPO=$(git remote get-url origin | sed -E 's%.+github.com/(.*).git$%\1%')
    echo "🔄 Syncing ${REPO}...\\n"
    gh repo sync ${REPO} && git pull
}
alias gsy=git-sync
```

## 嬉しさ
もともとは以下の2ステップだったが前述のスクリプトを使うと1ステップにまとめることができる。
1. ブラウザで`Sync fork > Update branch`をクリック
2. ローカルで`git pull`を実行
