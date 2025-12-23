---
title: "2025年を振り返る"
tags:
  - "振り返り"
  - "OSS"
  - "blog"

description: ""
date: 2025-12-22T23:55:39+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
cover: "cover.png"
---

年の瀬なので1年を振り返る。

## OSS
### PRでの貢献
GitHubとGerritで54件のPR[^1]を作成し48件のPRがマージされた。([GitHub](https://github.com/pulls?q=is%3Apr+archived%3Afalse+is%3Aclosed+author%3Akyu08+is%3Apublic+-user%3Akyu08+created%3A2025-01-01..2025-12-31+)[^2] [Gerrit](https://go-review.googlesource.com/q/owner:kyu.subsub@gmail.com))

去年の数字が以下だったのでPR作成数、マージされたPR数ともに微増だった。

> 49件のPRを作成1し43件のPRがマージされた。

PR一覧は以下のような感じ。

#### 機能追加
- [jesseduffield/lazygit - Add "CopyToClipboard" command to ConfirmationController](https://github.com/jesseduffield/lazygit/pull/4810)
- [jesseduffield/lazygit - Add new command "Checkout previous branch"](https://github.com/jesseduffield/lazygit/pull/4728)
- [nabekou29/pair-lens.nvim - feat: add Go expression_switch_statement and type_switch_statement support](https://github.com/nabekou29/pair-lens.nvim/pull/2)

#### ドキュメント関連
- [Homebrew/homebrew-cask - cursor: update homepage link](https://github.com/Homebrew/homebrew-cask/pull/200288)
- [rust-lang/this-week-in-rust - Add project update: "fzf-make v0.65.0"](https://github.com/rust-lang/this-week-in-rust/pull/7158)
- [ratatui/.github - Fix typo Javascript -> JavaScript](https://github.com/ratatui/.github/pull/2)
- [genkit-ai/docsite - Fix incorrect field name in express authentication example](https://github.com/genkit-ai/docsite/pull/158)
- [humanlayer/12-factor-agents - Fix typo](https://github.com/humanlayer/12-factor-agents/pull/73)
- [humanlayer/12-factor-agents - Delete unnecessary \]](https://github.com/humanlayer/12-factor-agents/pull/72)
- [go-task/task - chore: delete unnecessary whitespace](https://github.com/go-task/task/pull/2394)
- [go-task/task - docs: add fzf-make to "Community Integrations"](https://github.com/go-task/task/pull/2393)
- [jesseduffield/lazygit - Update the badges of golangci-lint and homebrew in README.md](https://github.com/jesseduffield/lazygit/pull/4807)
- [jesseduffield/lazygit - Update CONTRIBUTING.md to clarify translation contribution process](https://github.com/jesseduffield/lazygit/pull/4806)
- [nvim-orgmode/orgmode - docs: fix absences of line break](https://github.com/nvim-orgmode/orgmode/pull/985)
- [bnjbvr/cargo-machete - doc: rename job name in example workflow](https://github.com/bnjbvr/cargo-machete/pull/168)
- [rust-lang/cargo - docs: update version notice for deprecation removal](https://github.com/rust-lang/cargo/pull/15511)
- [geek-rabb1t/geek-rabb1t.github.io - typoを修正](https://github.com/geek-rabb1t/geek-rabb1t.github.io/pull/1)
- [h3pei/trace-pr.nvim - docs: describe the default value of trace_by_commit_hash_when_pr_not_found explicitly in README.md](https://github.com/h3pei/trace-pr.nvim/pull/4)
- [golangci/golangci-lint - docs: explicitly describe that the migrate command automatically migrate linters.presets](https://github.com/golangci/golangci-lint/pull/5697)
- [catppuccin/lazygit - doc: remove deprecated selectedRangeBgColor key from example](https://github.com/catppuccin/lazygit/pull/53)
- [yykamei/block-merge-based-on-time - Add ready_for_review as the workflow trigger to the example in README.md](https://github.com/yykamei/block-merge-based-on-time/pull/2192)
- [yuki-yano/zeno.zsh - docs(readme): replace exa with eza](https://github.com/yuki-yano/zeno.zsh/pull/81)
- [nand2tetris/web-ide - Fix typo in projects/src/project_08/21_nested_call.ts(initliazes -> initializes)](https://github.com/nand2tetris/web-ide/pull/559)
- [cloudspannerecosystem/yo - Add installation method for Go 1.16+](https://github.com/cloudspannerecosystem/yo/pull/147)
- [703735: GoUsers: add Canary Inc.](https://go-review.googlesource.com/c/wiki/+/703735)
- [703736: GoUsers: fix the position of CloudSign](https://go-review.googlesource.com/c/wiki/+/703736)

#### バグ修正
- [derailed/k9s - feat(pulse): map hjkl to navigate as help shows](https://github.com/derailed/k9s/pull/3699)

#### CI、開発環境等の修正
- [jesseduffield/lazygit - Add synchronize event to the hooks of "Check Required Labels"](https://github.com/jesseduffield/lazygit/pull/4974)
- [jesseduffield/lazygit - Use ignore directive to ignore test files not to be passes to gofumpt](https://github.com/jesseduffield/lazygit/pull/4936)
- [jesseduffield/lazygit - Update go to 1.25](https://github.com/jesseduffield/lazygit/pull/4844)
- [jesseduffield/lazygit - Run label check workflow only on label events and open pr event](https://github.com/jesseduffield/lazygit/pull/4830)
- [jesseduffield/lazygit - Enhance PR/Issue templates readability](https://github.com/jesseduffield/lazygit/pull/4829)
- [jesseduffield/lazygit - Pass only Git-tracked Go files to gofumpt](https://github.com/jesseduffield/lazygit/pull/4809)

#### 翻訳
- [rust-lang/surveys - \[Japanese\] replace "prioritising work" with "problems to productivity" in 2024 survey](https://github.com/rust-lang/surveys/pull/329)

#### 自作TUIのbrew release関連
- [Homebrew/homebrew-core - fzf-make 0.65.0](https://github.com/Homebrew/homebrew-core/pull/249550)
- [Homebrew/homebrew-core - fzf-make 0.64.0](https://github.com/Homebrew/homebrew-core/pull/249255)
- [Homebrew/homebrew-core - fzf-make 0.63.0](https://github.com/Homebrew/homebrew-core/pull/248909)
- [Homebrew/homebrew-core - fzf-make 0.62.0](https://github.com/Homebrew/homebrew-core/pull/246767)
- [Homebrew/homebrew-core - fzf-make 0.61.0](https://github.com/Homebrew/homebrew-core/pull/242247)
- [Homebrew/homebrew-core - fzf-make: add task to available runner in description](https://github.com/Homebrew/homebrew-core/pull/234337)
- [Homebrew/homebrew-core - fzf-make 0.60.0](https://github.com/Homebrew/homebrew-core/pull/233946)
- [Homebrew/homebrew-core - fzf-make: update desc](https://github.com/Homebrew/homebrew-core/pull/223065)
- [Homebrew/homebrew-core - fzf-make 0.59.0](https://github.com/Homebrew/homebrew-core/pull/223063)
- [Homebrew/homebrew-core - fzf-make 0.58.0](https://github.com/Homebrew/homebrew-core/pull/222737)
- [Homebrew/homebrew-core - fzf-make 0.57.0](https://github.com/Homebrew/homebrew-core/pull/222421)
- [Homebrew/homebrew-core - fzf-make 0.56.0](https://github.com/Homebrew/homebrew-core/pull/205485)
- [Homebrew/homebrew-core - fzf-make 0.55.0](https://github.com/Homebrew/homebrew-core/pull/203296)
- [Homebrew/homebrew-core - fzf-make 0.54.0](https://github.com/Homebrew/homebrew-core/pull/203265)


### 寄付
この記事を書いたときから継続して[Neovim](https://github.com/sponsors/neovim)と[ratatui](https://github.com/sponsors/ratatui)に5$/monthずつ寄付し続けている。

https://blog.kyu08.com/posts/renew-oss-sponsoring/

だいたい累計$150くらい寄付したことになる。OSSコミュニティの持続可能性に少しでも貢献していきたいのでこれからも続けていく。

### 振り返り
- PR数ベースで去年と同じくらいのペースでPRを送れた。（月平均4.5件ペース）[^3]
- LazygitのGitHubのトップページのContributors一覧入りを果たした
    - GitHubではcommit数が多い順にrepositoryにもよるが12人前後までのアイコンがContributorsに表示される。
    - 細々とcontributionを続けたところのcommit数トップ9人に入れた。（2025/12/23現在）
        ![lazygit-contibutors.webp](lazygit-contibutors.webp)
- Gerrit初めてつかった。

感謝されるのは嬉しいし、OSSの持続可能性にも少しでも貢献していきたいので引き続きやっていきたい。

社内でもOSSは楽しいぞーという話を何回かしたところ、OSS貢献にトライしてくれる方が何名かいたのもすごく嬉しかった。

## 個人開発
- fzf-make
    - スター数
    - 追加した機能の紹介

## 仕事
- 転職した
- MVPを受賞した

## ブログ
- OGPを動的生成するようにした
- Heading要素のデザインを変えた
- プレビュー環境を整えた
- 今年のPV数を振り返る？

## 読書など
- 読んだ本を紹介

## 生活
- ジムに行き始めた
- なんか早く寝れるようになってきた
- お昼ご飯たくさん食べると午後の仕事が捗ることに気づいた

## 2026年の豊富
## おわりに

[^1]: 便宜的にPRと表記しているが、GerritではCL(たしかChange List)と呼ばれる。
[^2]: Ownerが自分以外のPublic Repositoryを対象に集計。
[^3]: brew releaseに関してはfzf-makeの新バージョンをリリースする際にCIから自動でPRを送っているので本質的なOSS貢献かと言われるとちょっと微妙ではある。
