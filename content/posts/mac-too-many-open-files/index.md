---
title: "`Process failed to start: too many open files: \"/opt/homebrew/bin/git\"`というエラーが出てNeovimのプラグインが動作しなくなる問題の回避策"
tags: ["neovim"]
keywords: ["neovim"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-05-13T13:11:01+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

## 問題
ここ数日Neovimを使っていると、`Process failed to start: too many open files: "/opt/homebrew/bin/git"`といったエラーとともにプラグインが動作しなくなることがあり困っていた。

記憶にある範囲だと[nvim-telescope/telescope.nvim](https://github.com/nvim-telescope/telescope.nvim)や[akinsho/toggleterm.nvim](https://github.com/akinsho/toggleterm.nvim)を使っているときにこのエラーが起きることが多かった印象。

## 筆者の環境
```sh
$ nvim --version
NVIM v0.9.5
Build type: Release
LuaJIT 2.1.1703358377
```

利用しているプラグインは後述。

## 回避策

この記事にしたがってファイルを作成したところエラーが出なくなった。

https://qiita.com/sou_lab/items/1ca051a1f3b906a23dc8

以下記事より引用。

> ```sh
> sudo vi /Library/LaunchDaemons/limit.maxfiles.plist
> ```
>
> viでもnanoでもcodeでもお好きなエディタのコマンドで下記コードをコピペ。
> 
> ```xml
> <?xml version="1.0" encoding="UTF-8"?>
> <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
> <plist version="1.0">
>   <dict>
>     <key>Label</key>
>     <string>limit.maxfiles</string>
>     <key>ProgramArguments</key>
>     <array>
>       <string>launchctl</string>
>       <string>limit</string>
>       <string>maxfiles</string>
>       <string>524288</string>
>       <string>524288</string>
>     </array>
>     <key>RunAtLoad</key>
>     <true/>
>     <key>ServiceIPC</key>
>     <false/>
>   </dict>
> </plist>
> ```

## 参考
同時に開くことができるファイル数の上限に引っかかってしまっている模様。

もしかしたら一部のNeovimプラグインの特定のバージョンに原因があるのかもしれない。

もしかしたらこれをみた人の参考になるかもしれないので`lazy-lock.json`を貼っておく。（原因特定までする元気はなかった）

```json
{
  "Comment.nvim": { "branch": "master", "commit": "0236521ea582747b58869cb72f70ccfa967d2e89" },
  "alpha-nvim": { "branch": "main", "commit": "41283fb402713fc8b327e60907f74e46166f4cfd" },
  "barbecue": { "branch": "main", "commit": "cd7e7da622d68136e13721865b4d919efd6325ed" },
  "bufferline.nvim": { "branch": "main", "commit": "73540cb95f8d95aa1af3ed57713c6720c78af915" },
  "cmp-buffer": { "branch": "main", "commit": "3022dbc9166796b644a841a02de8dd1cc1d311fa" },
  "cmp-look": { "branch": "master", "commit": "971e65a6be0e75c3438fe7b176d4fc020cb89d7b" },
  "cmp-nvim-lsp": { "branch": "main", "commit": "5af77f54de1b16c34b23cba810150689a3a90312" },
  "cmp-nvim-lsp-signature-help": { "branch": "main", "commit": "3d8912ebeb56e5ae08ef0906e3a54de1c66b92f1" },
  "cmp-nvim-lua": { "branch": "main", "commit": "f12408bdb54c39c23e67cab726264c10db33ada8" },
  "cmp-path": { "branch": "main", "commit": "91ff86cd9c29299a64f968ebb45846c485725f23" },
  "cmp-vsnip": { "branch": "main", "commit": "989a8a73c44e926199bfd05fa7a516d51f2d2752" },
  "copilot.vim": { "branch": "release", "commit": "b603990a639bb4b8651d054ef8d5a8fe5db56e0c" },
  "dial.nvim": { "branch": "master", "commit": "27eb570085db2ef44bff4f620d3806039184651c" },
  "fzf": { "branch": "master", "commit": "24ff66d4a9d6889988e4d7e373f33f4098870b9e" },
  "gitsigns.nvim": { "branch": "main", "commit": "bc933d24a669608968ff4791b14d2d9554813a65" },
  "gotests-vim": { "branch": "master", "commit": "42abccb59e9889cd1ce427b11b2ffbb36f2a46a6" },
  "gruvbox.nvim": { "branch": "main", "commit": "dd0ab08b17d2ead7bdb4838b48e1d08034ead0f0" },
  "harpoon": { "branch": "harpoon2", "commit": "0378a6c428a0bed6a2781d459d7943843f374bce" },
  "indent-blankline.nvim": { "branch": "master", "commit": "3d08501caef2329aba5121b753e903904088f7e6" },
  "lasterisk.nvim": { "branch": "main", "commit": "bbcfcaeca50f686e338a03386e41645fc3305f44" },
  "lazy.nvim": { "branch": "main", "commit": "ebdd0499551765e6a7aba220cc8ae4e0cdb6be69" },
  "lazygit.nvim": { "branch": "main", "commit": "0ada6c6e7e138df92f5009b6952f4ac41248305a" },
  "lsp-lens.nvim": { "branch": "main", "commit": "48bb1a7e271424c15f3d588d54adc9b7c319d977" },
  "lsp_signature.nvim": { "branch": "master", "commit": "c6aeb2f1d2538bbdfdaab1664d9d4c3c75aa9db8" },
  "lspkind.nvim": { "branch": "master", "commit": "1735dd5a5054c1fb7feaf8e8658dbab925f4f0cf" },
  "lspsaga.nvim": { "branch": "main", "commit": "052234296f13e2705d5d290c7bd5a36d3dd81fde" },
  "lualine.nvim": { "branch": "master", "commit": "0a5a66803c7407767b799067986b4dc3036e1983" },
  "mason-lspconfig.nvim": { "branch": "main", "commit": "05744f0f1967b5757bd05c08df4271ab8ec990aa" },
  "mason.nvim": { "branch": "main", "commit": "751b1fcbf3d3b783fcf8d48865264a9bcd8f9b10" },
  "neo-tree.nvim": { "branch": "v2.x", "commit": "80dc74d081823649809f78370fa5b204aa9a853a" },
  "noice.nvim": { "branch": "main", "commit": "f4decbc7a80229ccc9f86026b74bdcf0c39e38a7" },
  "nui.nvim": { "branch": "main", "commit": "274fa89a9b4bed746647c2917091902f882509ec" },
  "nvim-autopairs": { "branch": "master", "commit": "14e97371b2aab6ee70054c1070a123dfaa3e217e" },
  "nvim-bqf": { "branch": "main", "commit": "52703d7adc3be3f7c09eea9a80c5b8caa615fb25" },
  "nvim-cmp": { "branch": "main", "commit": "8f3c541407e691af6163e2447f3af1bd6e17f9a3" },
  "nvim-hlslens": { "branch": "main", "commit": "3e8fceb2b030100857ee72741a8f48c9a1d8595e" },
  "nvim-jdtls": { "branch": "master", "commit": "8eb5f0dbe6e126b392ddcaf45893358619893e45" },
  "nvim-lspconfig": { "branch": "master", "commit": "ee450e6a9364fc740236166dd57aaca1ec7cdb48" },
  "nvim-metals": { "branch": "main", "commit": "c6268555d0b471262af78818f11a086ddf30688b" },
  "nvim-navic": { "branch": "master", "commit": "8649f694d3e76ee10c19255dece6411c29206a54" },
  "nvim-scrollbar": { "branch": "main", "commit": "35f99d559041c7c0eff3a41f9093581ceea534e8" },
  "nvim-treesitter": { "branch": "master", "commit": "4b70dde72753a179333b4bba02518d234a30510e" },
  "nvim-ts-context-commentstring": { "branch": "main", "commit": "a6382f744f584bbf71d0a563af789af7190aabda" },
  "nvim-web-devicons": { "branch": "master", "commit": "475fbcfcb6ee7c35aa33a6b6207ebd4032791d87" },
  "plenary.nvim": { "branch": "master", "commit": "08e301982b9a057110ede7a735dd1b5285eb341f" },
  "pounce.nvim": { "branch": "master", "commit": "0c044cad69571d57d8f64a41cca95332859b6abc" },
  "sqlite.lua": { "branch": "master", "commit": "d0ffd703b56d090d213b497ed4eb840495f14a11" },
  "telescope-egrepify.nvim": { "branch": "master", "commit": "728dc1b7f31297876c3a3254fc6108108b6a9e9d" },
  "telescope-frecency.nvim": { "branch": "master", "commit": "6b6565e6584c86ca501bdac485cbdc2ca64556e4" },
  "telescope-fzf-native.nvim": { "branch": "main", "commit": "9ef21b2e6bb6ebeaf349a0781745549bbb870d27" },
  "telescope.nvim": { "branch": "master", "commit": "fac83a556e7b710dc31433dec727361ca062dbe9" },
  "todo-comments.nvim": { "branch": "main", "commit": "a7e39ae9e74f2c8c6dc4eea6d40c3971ae84752d" },
  "toggleterm.nvim": { "branch": "main", "commit": "066cccf48a43553a80a210eb3be89a15d789d6e6" },
  "translate.nvim": { "branch": "main", "commit": "30cc9e9f339b61e7bd40bc1ba7af73ea193bf589" },
  "vim-illuminate": { "branch": "master", "commit": "e522e0dd742a83506db0a72e1ced68c9c130f185" },
  "vim-test": { "branch": "master", "commit": "eb5bd18d58a859e7d55d732d37e4e2b94fa50275" },
  "vim-to-github": { "branch": "master", "commit": "9ea9c75b6cd48bd42823a39c56a05a2ff8161536" },
  "vim-vsnip": { "branch": "master", "commit": "02a8e79295c9733434aab4e0e2b8c4b7cea9f3a9" },
  "vim-vsnip-integ": { "branch": "master", "commit": "1914e72cf3de70df7f5dde476cd299aba2440aef" },
  "yode-nvim": { "branch": "develop", "commit": "eaf3141b919c143ebf174d7ad180abd9c032b38c" }
}
```
