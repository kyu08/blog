---
title: Notionのダークモードのガントチャートが見づらいのをChrome拡張で修正する方法
tags:
  - Notion
  - Chrome Extension
keywords:
  - Notion
  - Chrome Extension
description: ''
date: 2024-11-08T14:34:37.000Z
author: kyu08
authorTwitter: kyu08_
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ''
cover: cover.webp
---

## できること
Notionのガントチャートが見づらいのをなんとかするスクリプト

### Before
![before.webp](before.webp)

### After
![after.webp](after.webp)

## 前提条件
NotionをChromium系のブラウザで利用していること

## やり方
1. 下記のリンクからStylusをインストール
    https://chromewebstore.google.com/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne?hl=ja
1. Manageをクリックして管理画面を開く
    ![open-management-window.webp](open-management-window.webp)
1. Write new styleをクリック
    ![click-write-new-style.webp](click-write-new-style.webp)
1. 次のCSSを入力しURLのブロックに`URLs starting with: https://www.notion.so/`を指定しSaveをクリック
    ```css
    .notion-selectable.notion-page-block.notion-timeline-item a {
        background: rgba(255, 255, 255, 0.15)
    }
    ```
    ![set-configs.webp](set-configs.webp)
1. みやすくなる
    ![after.webp](after.webp)

