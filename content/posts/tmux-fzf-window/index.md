---
title: "tmux-fzfを使ってwindow切り替えをできるようにする手順"
tags: ["tmux", "ターミナル"]
keywords: ["tmux", "ターミナル"]

description: ""
date: 2024-04-10T23:12:22+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

## これはなに
こんな感じでtmuxでwindowをfzfで切り替えられるようにするための設定方法

![https://blog.kyu08.com/posts/my-dev-setup-terminal/tmux-fzf.gif](https://blog.kyu08.com/posts/my-dev-setup-terminal/tmux-fzf.gif)

## 手順

1. `.tmux.conf`に以下を追記

    ```tmux
    set -g @plugin 'tmux-plugins/tpm' # すでにある場合は不要
    set -g @plugin 'sainnhe/tmux-fzf'
    bind-key "space" run-shell -b "${HOME}/.tmux/plugins/tmux-fzf/scripts/window.sh switch" # `prefix + space`で起動

    run '~/.tmux/plugins/tpm/tpm' # すでにある場合は不要
    ```

2. `prefix + I`でtpm経由でプラグインをインストール(`prefix + i`ではないので注意)
