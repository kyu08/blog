---
title: "RFC 2606: Reserved Top Level DNS Namesを読んで知らなかったことを書く"
tags: ["RFC"]
keywords: ["RFC"]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-12-16T00:00:00+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---

本記事は[Unipos Advent Calendar 2024](https://qiita.com/advent-calendar/2024/unipos)の16日目の記事です。

ふいに見かけた[RFC 2606: Reserved Top Level DNS Names](https://datatracker.ietf.org/doc/html/rfc2606)を読んでみたところ発見があったのでその内容をまとめてみようと思います。

## RFC 2606の概要

> Abstract
> 
> To reduce the likelihood of conflict and confusion, a few top level
> domain names are reserved for use in private testing, as examples in
> documentation, and the like.  In addition, a few second level domain
> names reserved for use as examples are documented.

- 対立や混乱を減らす目的でいくつかのTLD名が予約されている。用途はプライベートなテスト用、ドキュメントでの例示用など。
- 上記に加えて例示用にいくつかのSecond Level Domain Namesが予約されている。

## 予約されたTop Level Domain Names
> There is a need for top level domain (TLD) names that can be used for
> creating names which, without fear of conflicts with current or
> future actual TLD names in the global DNS, can be used for private
> testing of existing DNS related code, examples in documentation, DNS
> related experimentation, invalid DNS names, or other similar uses.

DNSのプライベートテスト用やドキュメントなどの目的で使用できるTLD名が必要であるとのこと。（DNSへの解像度がとても低いので具体的にどんなテストが行われるのかの想像はついていない...）[^1]

> To safely satisfy these needs, four domain names are reserved as
> listed and described below.
>
>                 .test
>              .example
>              .invalid
>            .localhost
>
>    ".test" is recommended for use in testing of current or new DNS
>    related code.
>
>    ".example" is recommended for use in documentation or as examples.
>
>    ".invalid" is intended for use in online construction of domain
>    names that are sure to be invalid and which it is obvious at a
>    glance are invalid.
>
>    The ".localhost" TLD has traditionally been statically defined in
>    host DNS implementations as having an A record pointing to the
>    loop back IP address and is reserved for such use.  Any other use
>    would conflict with widely deployed code which assumes this use.

上記のニーズを満たすために、次の4つのTLD名が予約されている。

- `.test`: 既存のまたは新規のDNS関連コードのテストに使用することが推奨されている。
- `.example`: ドキュメントや例示として使用することが推奨されている。
- `.invalid`: 無効であることが確実で一目で無効であることが明らかなドメイン名をオンラインで構築する際に使用することを目的としている。
- `.localhost`: 伝統的にホストDNS実装においてループバックIPアドレスを指すAレコードを持つものとして静的に定義されておりこのような使用のために予約されている。

`.invalid`の説明がわからなかったのでWikipadiaを参照してみたところ次のような記述があった。

> This top-level domain is sometimes used as a pseudo domain name in Uniform Resource Identifiers (URIs) to convey either an error condition or in use of privacy protection.
> 
> https://en.wikipedia.org/wiki/.invalid より引用

要はエラーケースのテストのためやプライバシー保護の目的で擬似ドメイン名として利用されることがある、と理解した。(このあたりの深い理解は別途時間をとりたい)

これらのTLD名は見たことはあったがRFCとして明示されていることは知らなかった。

## 予約されたSecond Level Domain Names

> 3 Reserved Example Second Level Domain Names
> 
> The Internet Assigned Numbers Authority (IANA) also currently has the
> following second level domain names reserved which can be used as
> examples.
> 
>      example.com
>      example.net
>      example.org

`example.com`以外にも`example.net`と`example.org`が予約されていることは知らなかった。

また、`4. IANA Considerations`にも記述があるが、本文章で示されたTLD名およびSecond Level Domain名はInternet Assigned Numbers Authority(IANA)によって予約される。

## 著作権表示
>   Copyright (C) The Internet Society (1999).  All Rights Reserved.
>
>   This document and translations of it may be copied and furnished to
>   others, and derivative works that comment on or otherwise explain it
>   or assist in its implementation may be prepared, copied, published
>   and distributed, in whole or in part, without restriction of any
>   kind, provided that the above copyright notice and this paragraph are
>   included on all such copies and derivative works.  However, this
>   document itself may not be modified in any way, such as by removing
>   the copyright notice or references to the Internet Society or other
>   Internet organizations, except as needed for the purpose of
>   developing Internet standards in which case the procedures for
>   copyrights defined in the Internet Standards process must be
>   followed, or as required to translate it into languages other than
>   English.

## 感想
はじめてRFCを読んだ。部分的に馴染みのある内容だったし文量としても多くなかったのでスムーズに読めた。

これまでは「誰かがテスト用ドメインとして`example.com`を抑えてくれているのでテスト用に使ってOK」という程度の理解だったが、いくつかのDomain名がテスト、例示目的で予約されることがRFCで明示されておりIANAが実際にそれらを予約していることでテスト用ドメインが利用できているということを知ることができた。

物事を正確に理解するとトラブルシューティングや改善も素早くできるはずだし、知らなかったことをブログに書くと自分の理解も捗る(あと純粋に楽しい)ので、これからも自分の理解が曖昧なことを理解し共有する営みをやっていきたい。

改めてネットワークは本当に何もわからないのでこの冬に時間をとって勉強したい。[^2] [^3]

[^1]: [Linuxで動かしながら学ぶTCP/IPネットワーク入門](https://www.amazon.co.jp/Linux%E3%81%A7%E5%8B%95%E3%81%8B%E3%81%97%E3%81%AA%E3%81%8C%E3%82%89%E5%AD%A6%E3%81%B6TCP-IP%E3%83%8D%E3%83%83%E3%83%88%E3%83%AF%E3%83%BC%E3%82%AF%E5%85%A5%E9%96%80-%E3%82%82%E3%81%BF%E3%81%98%E3%81%82%E3%82%81-ebook/dp/B085BG8CH5)や[体験しながら学ぶ ネットワーク技術入門](https://www.sbcr.jp/product/4815618599/)あたりで腰を据えてネットワーク周りを学びたい...。
[^2]: が、次は[コンピュータシステムの理論と実装 第2版](https://www.oreilly.co.jp/books/9784814400874/)をやると決めているのでやるとしたらその次かな...。
[^3]: ちなみに、他のRFCを眺めていたら`SHOULD`, `MUST`のようなキーワードが大文字で強調されていたが、それらのキーワードの解釈については[RFC 2119: Key words for use in RFCs to Indicate Requirement Levels](https://datatracker.ietf.org/doc/html/rfc2119)で説明されていたのでよければ参照ください。
