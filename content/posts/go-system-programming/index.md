---
title: "『Goならわかるシステムプログラミング 第2版』を読んだ"
tags: ["Go", "CS"]
keywords: ["Go", "CS"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-06-22T21:42:30+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

# 第1章 Go言語で覗くシステムプログラミングの世界
- デバッガを使って`fmt.Println`の動作をシステムコールまで追った。[^1]
- 当然だがデバッガを使うと変数の中身に何が入ってるかがわかって便利。
- デバッガを使ってみて別パッケージのprivate変数の中身を見ることができるのはプリントデバッグにはないデバッガの利点だと気づいた。

# 第2章 低レベルアクセスへの入口1：io.Writer
- `io.Writer`はOSが持つファイルのシステムコールの相似形
- OSでは、システムコールを**ファイルディスクリプタ**と呼ばれるものに対して呼ぶ。
- ファイルディスクリプタ(file descriptor)は一種の識別子（数値）で、この数値を指定してシステムコールを呼び出すと、数値に対応するモノにアクセスできる。
- ファイルディスクリプタはOSがカーネルのレイヤーで用意している抽象化の仕組み。
- OSのカーネル内部のデータベースに、プロセスごとに実体が用意される。
- OSはプロセスが起動されるとまず3つの擬似ファイルを作成し、それぞれにファイルディスクリプタを割り当てる。
- `0`が標準入力、`1`が標準出力、`2`が標準エラー出力。
- 以降はそのプロセスでファイルをオープンしたりソケットをオープンしたりするたびに1ずつ大きな数値が割り当てられていく。

複数のファイル`f1`, `f2`を`os.Create()`する処理をデバッガーで追ってみたところ、それぞれファイルディスクリプタの値が`3`, `4`[^2]となっておりファイルディスクリプタの値が`3`からインクリメントされる様子を確認できた。

<!-- TODO: 画像をローカルに保存してリンクを貼る -->
![](https://github.com/kyu08/go-system-programming/assets/49891479/5552c07a-44e0-4ae0-8d82-f79f383392c5)

# 第3章 低レベルアクセスへの入口1：io.Reader
## エンディアン変換
- リトルエンディアンでは、10000という数値(`0x2710`)をメモリに格納するときに下位バイトから順に格納する。
- ビッグエンディアンでは、上位バイトから順に格納する。
- 現在主流のCPUではリトルエンディアンが採用されている。
- ネットワーク上で転送されるデータの多くはビッグエンディアンが用いられている。
- そのため多くの環境ではネットワークで受け取ったデータをリトルエンディアンに変換する必要がある。
## `io`パッケージのいくつかの関数 / 構造体 / インターフェースの使い方
- `io.Pipe`[^3]
- `io.LimitReader`: 先頭の`n`バイトだけ読み込む
- `io.MultiReader`: 複数の`io.Reader`を1つの`io.Reader`にまとめる
- `io.SectionReader`: `offset`と`n`を指定して一部のデータだけ読み込む

# 第4章 チャネル
普段goroutineを全然使わないので忘れていることが多かった。以下学んだことメモ。

- バッファなしチャネルでは、受け取り側が受信しないと、送信側もブロックされる。[^4]
- `for task := range tasks // tasksは任意のch`のように書くと、チャネルに値が入るたびにループが回り、チャネルがクローズされるまでループが回る。

# 第5章 システムコール
## システムコールとは何か
- 特権モードでOSの機能を呼ぶこと

## CPUの動作モード
- OSの仕事は以下の2つ
    - 各種資源（メモリ、CPU時間、ストレージなど）の管理
    - 外部入出力機能の提供（ネットワーク、ファイル読み書き、プロセス間通信） 
- 動作モード
    - 実行してよいハードウェアとしての機能がソフトウェアの種類に応じて制限されている
    - OSが動作する特権モード
    - 一般的なアプリケーションが動作するユーザーモード

## システムコールが必要な理由
- 通常のアプリケーションでメモリ割り当てやファイル入出力、インターネット通信などの機能を使うために必要なのがシステムコール
- システムコールがなくてもCPUの命令そのものはほとんど使うことができる
- しかし、ユーザーモードでは計算した結果を画面に出力したり、ファイルに保存したり外部のWebサービスに送信したりできない。

`dtruss`コマンドを使ってシステムコールの呼び出しを確認しようとしたがmacOSのセキュリティの設定上何も表示されなかったのでdockerを使って確認してみることにした。

```shell
docker run -it --name stracetest golang:1.22.4-alpine3.19
apk add strace

go mod init kyu08/stracetest
# 任意のgoファイルを作成
go build ./...
strace -o strace.log ./実行ファイル
less strace.log
```

今回は`f, _ := os.Create("test_file.txt")`と`defer f.Close()`を実行するだけのgoプログラムを実行したときのシステムコールのログを確認した。以下はその一部。

```shell
rt_sigaction(SIGRT_32, {sa_handler=0x70d90, sa_mask=~[], sa_flags=SA_ONSTACK|SA_RESTART|SA_SIGINFO}, NULL, 8) = 0
rt_sigprocmask(SIG_SETMASK, ~[], [], 8) = 0
clone(child_stack=0x400001c000, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM) = 890
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
--- SIGURG {si_signo=SIGURG, si_code=SI_TKILL, si_pid=889, si_uid=0} ---
rt_sigreturn({mask=[]})                 = 1139696
rt_sigprocmask(SIG_SETMASK, ~[], [], 8) = 0
clone(child_stack=0x4000062000, flags=CLONE_VM|CLONE_FS|CLONE_FILES|CLONE_SIGHAND|CLONE_THREAD|CLONE_SYSVSEM) = 891
rt_sigprocmask(SIG_SETMASK, [], NULL, 8) = 0
futex(0x4000080148, FUTEX_WAKE_PRIVATE, 1) = 1
futex(0x4000048948, FUTEX_WAKE_PRIVATE, 1) = 1
prlimit64(0, RLIMIT_NOFILE, NULL, {rlim_cur=1024*1024, rlim_max=1024*1024}) = 0
fcntl(0, F_GETFL)                       = 0x20002 (flags O_RDWR|O_LARGEFILE)
futex(0x4000049148, FUTEX_WAKE_PRIVATE, 1) = 1
fcntl(1, F_GETFL)                       = 0x20002 (flags O_RDWR|O_LARGEFILE)
fcntl(2, F_GETFL)                       = 0x20002 (flags O_RDWR|O_LARGEFILE)
openat(AT_FDCWD, "test_file.txt", O_RDWR|O_CREAT|O_TRUNC|O_CLOEXEC, 0666) = 3
futex(0x115ea0, FUTEX_WAKE_PRIVATE, 1)  = 1
futex(0x115db8, FUTEX_WAKE_PRIVATE, 1)  = 1
fcntl(3, F_GETFL)                       = 0x20002 (flags O_RDWR|O_LARGEFILE)
fcntl(3, F_SETFL, O_RDWR|O_NONBLOCK|O_LARGEFILE) = 0
epoll_create1(EPOLL_CLOEXEC)            = 4
pipe2([5, 6], O_NONBLOCK|O_CLOEXEC)     = 0
epoll_ctl(4, EPOLL_CTL_ADD, 5, {events=EPOLLIN, data={u32=1549912, u64=1549912}}) = 0
epoll_ctl(4, EPOLL_CTL_ADD, 3, {events=EPOLLIN|EPOLLOUT|EPOLLRDHUP|EPOLLET, data={u32=3997171713, u64=18446585726557487105}}) = -1 EPERM (Operation not permitted)
fcntl(3, F_GETFL)                       = 0x20802 (flags O_RDWR|O_NONBLOCK|O_LARGEFILE)
fcntl(3, F_SETFL, O_RDWR|O_LARGEFILE)   = 0
close(3)                                = 0
exit_group(0)                           = ?
+++ exited with 0 +++
```

- `openat(AT_FDCWD, "test_file.txt", O_RDWR|O_CREAT|O_TRUNC|O_CLOEXEC, 0666) = 3`の部分でファイルが作成され、ファイルディスクリプタに`3`が割り当ている
- `close(3)                                = 0`の部分で`defer f.Close()`に相当する処理が行われている

ということを確認できた。

# 第6章 TCPソケットとHTTPの実装
## ソケットとは
<!-- TODO: 「ソケットとは？」の答えになってなくない？ -->
- ほとんどのOSではアプリケーション層からトランスポート層のプロトコルを利用するときのAPIとして**ソケット**という仕組みを利用している
- HTTP/1.0と1.1はこのソケットのバイトストリーム上に作られたテキストを使ったプロトコル

## ソケットの種類（本書で説明するもののみ）
- TCP：一番使われている。安定性が高い。
- UDP：通信開始が早い。相手に一方的に送りつける。
- Unixドメインソケット：ローカル通信でしか使えないが最速。

## ソケット通信の基本構造
- どんなソケット通信も基本となる構成は次のような形態
    - サーバー：ソケットを開いて待ち受ける
    - クライアント：開いているソケットに接続し、通信を行う
- GoではTCP通信が確立されると、送信側、受信側の両方に相手との通信を行う`net.Conn`インタフェースを満たすオブジェクトが渡ってくる

## Goに組み込まれているTCPの機能（`net.Conn`）だけを使ってHTTPによる通信を実現する
- `net.Conn`だけを使ってTCPソケットの初期化や通信の確立などの普段なら`net/http`がやってくれている部分を実装した。
- `http.ListenAndServe()`のコードを読んでみたら、[golang/go/src/net/http/server.go#L3258](https://github.com/golang/go/blob/c83b1a7013784098c2061ae7be832b2ab7241424/src/net/http/server.go#L3258)で本書のハンズオンと同じようにTCPソケットの初期化を行っていることを確認できた。

## 素朴な実装の速度改善
- ①Keep-Aliveへの対応
    - HTTP/1.1から入った規格
    - HTTP/1.0ではセットの通信が終わるたびにTCPコネクションが切れる仕様になっていたが、Keep-Aliveを使うことで、しばらくの間はTCP接続のコネクションを維持して使い回すことができる。
    - TCP接続の通信には一定のオーバーヘッドがあるが、Keep-Aliveを使うことでそのオーバーヘッドを削減できる。
- ②レスポンスの圧縮
    - レスポンスを圧縮することで、通信量を削減でき速度向上につながる。
    - レスポンスヘッダーは圧縮されないため、少量のデータを通信する場合は効率が悪くなる。そのため実際のデータ量に応じて圧縮するかどうかを判断する必要がありそう。
- ③チャンク形式のボディー送信
    - 動画など大きいデータを送信する場合、データを分割して送信することでデータの送信が完了する前に受信側でデータを処理できるようになる。また、すべてのデータをメモリに展開する必要もなくなるのでメモリの使用量を抑えることができるというメリットもある。
    - チャンク形式ではヘッダーに送信データのサイズを書かないかわりに`Transfer-Encoding: chunked`というヘッダーを付与する。
- ④パイプライニング
    - 送受信を非同期化する方法

# 第7章 UDPソケットを使ったマルチキャスト通信
## UDPとTCPの用途の違い
UDPはTCPと同じトランスポート層のプロトコルで以下のような特徴がある。

- 誰と繋がっているか管理しない
- データロスの検知をすることも通信速度の制限をすることもしない
- パケットの到着順序も管理しない

[^1]: Neovimでのデバッガの環境構築は [nvim-dapでGolangのデバッグ環境構築](https://zenn.dev/saito9/articles/32c57f776dc369) を参考にした
[^2]: `Sysfd`の定義はgolang/go/src/internal/poll/fd_unix.go#L23(https://github.com/golang/go/blob/c83b1a7013784098c2061ae7be832b2ab7241424/src/internal/poll/fd_unix.go#L23) にある。
[^3]: `io.Pipe`の使いどころに関しては [Go言語のio.Pipeでファイルを効率よくアップロードする方法](https://medium.com/eureka-engineering/file-uploads-in-go-with-io-pipe-75519dfa647b) が大変参考になった。
[^4]: cf. [kyu08/go-system-programming/4-channel/unbufferedchannel/main.go#L8](https://github.com/kyu08/go-system-programming/blob/b9da4a0ce759b2df4ce884ab61248fb893b60bef/4-channel/unbufferedchannel/main.go#L8)

