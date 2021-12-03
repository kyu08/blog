---
title: 'Elm で固定長配列が扱えるライブラリ elm-static-array を使ってみた'
published: '2021-12-18'
---

個人開発で Elm で固定長配列を扱うためのライブラリ elm-static-array(以下 StaticArray) を使ってみたので感じたことを書きます。

## elm-static-array とは
Elm で固定長配列を扱うためのライブラリです。

[https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/](https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/)


StaticArray を使うことで、たとえば長さが4で要素の型が `String` である配列は以下のように定義できます。

```elm
arrayLength4 : StaticArray Index.Four String
```

最も違いがわかりやすいのは配列の要素を取得する際でしょう。

```elm
-- 通常の配列
get : Int -> Array a -> Maybe a

-- StaticArray
get : Index n -> StaticArray n a -> a
```

通常の配列では要素の型がaである配列の要素を取得する際の返り値の型が `Maybe a` になりますが、 StaticArray では返り値の型が `a` になるというメリットがあります。
これにより `Maybe` をハンドリングする必要がなくなるためよりシンプルに記述できます。

また、仕様が型で表現しやすくなるという点もメリットといえるでしょう。

```elm
-- Array
type PlayerNames = Array String

-- StaticArray
-- 配列の長さが 4 であることが型で記述できる
type PlayerNames = StaticArray Index.Four String
```
ここまででライブラリの概要を簡単に説明しました。

ここからは実際に使ってみて感じたことについて書いていきます。

## どんな場面で使ったか
趣味で開発している麻雀の点数集計アプリで使いました。

麻雀では一般的に 【最終的なスコア = 試合終了時の持ち点 + 順位に応じたボーナスポイント 】という形で試合(半荘と呼ぶ)ごとスコアを計算し、最後にその日のトータルのスコア(全試合のスコアを合計)します。

通常は 【試合終了時の持ち点 + 順位に応じたボーナスポイント】の計算を暗算して紙に書く、という方法が一般的です。ただ、このやり方だと計算に時間がかかりますし、当然計算ミスをする可能性もあります。そこで【試合終了時の持ち点】だけ入力すれば順位を計算し、順位に応じたボーナスポイントを加算した結果を表示してくれる、というアプリをつくりました。



<img src='https://user-images.githubusercontent.com/49891479/144570446-7500f69d-cc20-48ef-a68e-d34373e864a7.png' height=300/>

半荘ごとの個人の素点を入力すると...

<img src='https://user-images.githubusercontent.com/49891479/144571507-4c7cf8ac-0a0e-4c49-bb69-3e5642c1ecd0.png' height=300/>

順位点を加味したポイントを表示してくれるというものです。

<img src='https://user-images.githubusercontent.com/49891479/144571797-b96d4ab2-a7d7-45c6-91aa-5a913e2d92ea.png' height=300/>

前提の説明が長くなってしまいましたが、雑にまとめると **整数の配列を受け取って加工して整数の配列を返すアプリケーション** ということです。

ここで **参加者の名前** および **その試合の最終的なスコア** を `Array String` で、扱おうとすると以下のようになるわけですが、これだとあらゆる長さの配列をとることができてしまいます。

```elm
type Players = Array String

type Points = Array String
```

そこで StaticArray を用いることで型で長さの情報を表現できます。

```elm
type Players
    = StaticArray Index.Four Player

type Points
    = StaticArray Index.Four Point
```

<!-- TODO: これ蛇足かも。全体を見直した上で必要そうだったらかく -->
<!-- レコードで持つことも考えたけど -->
<!--       - レコードだと map が面倒臭い。本来の用途じゃないし。 -->

## よかったところ
  - 型で仕様が表現できるためわかりやすい
    - (レコードでかいて custom type でもよくない？)
    - 同じことだけど"make impossible states impossible"が満たせるためバグや予期しない動作の可能性が減る
    - .get が Maybe になることがないためシンプルにかける(ただし全体としてのコード量は増える)
## 微妙だったところ
  - コード量が増える
    - 使い所を考えないと大変なことになるかもしれない？
  - 慣れるまでは時間がかかる
    - ふつうの Array との違い
## 使ってないけどこういうケースでよさそう
## こういうケースでおすすめ
## こういうケースだとおすすめできない
## まとめ
## 内部実装について
  - phantom type について理解できていると語れそう
    > 固定長の配列を使用してください！すべてのチェックはコンパイル時に行われます。これは可能ですか？はい、そうです！魔法の言葉はファントムタイプです。(https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/ の冒頭より)



