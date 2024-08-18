---
title: "ブラウザからforkすると遅いのでCLIからfork & cloneするスクリプトを書いた"
tags: ["GitHub", "cli", "zsh"]
keywords: ["GitHub", "cli", "zsh"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-08-18T15:52:01+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

## モチベーション
GitHubにホストされているOSSにPRを出す時にforkしてからローカルにcloneするが、ブラウザのforkボタンを使ってforkすると時間がかかることが多いのでCLIでワンコマンドでforkとcloneをできるようにした。

これまでの手順は以下のような手順が必要だった。

1. ブラウザでforkボタンを押す
1. forkの完了を待つ
1. ブラウザに表示されるcloneコマンドをコピー(`gh repo clone owner/repo`みたいなやつ)
1. ターミナルでコマンドを実行してforkしたリポジトリをcloneする

これを以下のステップでできるようにした。

1. リポジトリのURLまたは`OWNER/REPO`形式の文字列をコピー
1. コマンドに1. で取得した文字列を渡して実行

## つくったスクリプト
以下を`.zshrc`などに追加すると使えるようになる。`alias`の部分はお好みで。[^1]

```bash
function git-fork-clone() {
    # 入力からowner/repoを取り出す。owner/repoのような形式でもURLでもOK
    REPO=$(echo $1 | sed -E 's@.+github.com/([^/]+)/([^/]+).*@\1/\2@')
    echo "🐙 ${REPO} will be forked and cloned.\\n"
    # -- 以降のオプションはgit cloneに渡される
    # See: https://cli.github.com/manual/gh_repo_fork
    gh repo fork ${REPO} --default-branch-only --clone=true -- --depth=1
}
alias gf=git-fork-clone
```

## 前提
`gh`コマンドがインストールされていること

## 使い方

```bash
$ git-fork-clone https://github.com/cli/cli
```

上記を実行すると以下のような出力が表示され、リポジトリのforkとcloneが行われる。

```bash
🐙 cli/cli will be forked and cloned.

✓ Created fork kyu08/cli
Cloning into 'cli'...
remote: Enumerating objects: 31, done.
remote: Counting objects: 100% (31/31), done.
remote: Compressing objects: 100% (30/30), done.
remote: Total 31 (delta 0), reused 10 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (31/31), 20.41 KiB | 10.20 MiB/s, done.
From github.com:cli/cli
 * [new branch]      main       -> upstream/main
 * [new tag]         v1.0.1     -> v1.0.1
✓ Cloned fork
```

`git-fork-clone https://github.com/cli/cli/pulls` や `git-fork-clone cli/cli` のような形式でも動く。

## まとめ
また人類のOSS貢献力を加速させてしまいました。

[^1]: 完全に余談だがスクリプトの`REPO=...`の部分は https://www.tutorialspoint.com/execute_bash_online.php を使って出先で書いた。スマホでもシェルスクリプトが書けて便利。
