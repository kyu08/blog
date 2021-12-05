---
title: 'Elm で固定長配列が扱えるライブラリ elm-static-array を触ってみた'
published: '2021-12-18'
---


<!-- TODO --> 
<!-- TODO: を消化する -->
<!-- 1. 推敲・正確性をあげたりする -->
<!-- メインパートであるよかったところ・微妙だったところの内容をいい感じにしていく -->
<!-- なぜ使ったのかって書いた方がいいかな -->
<!-- textlint の error を解消する -->

Elm で固定長配列を扱うためのライブラリ elm-static-array を触ってみたので感じたことを書きます。

## elm-static-array とは
<!-- 全部 elm-static-array って書いた方がいいかな -->
[elm-static-array](https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/) は Elm で固定長配列を扱うためのライブラリです。(以下 StaticArray)

StaticArray を使うことで、たとえば長さが4で要素の型が `String` である配列は以下のように定義できます。

```elm
arrayLength4 : StaticArray Index.Four String
```

<!-- ここの書き方微妙 -->
通常の Array と比べて仕様を型で表現しやすくなるという点は StaticArray を利用するメリットといえるでしょう。


```elm
-- Array
type PlayerNames = Array String

-- StaticArray
-- 配列の長さが 4 であることが型で表現できる
type PlayerNames = StaticArray Index.Four String
```

また、配列の要素を取得する際も通常の Array との違いを感じることができます。

```elm
-- 通常の配列
get : Int -> Array a -> Maybe a

-- StaticArray
get : Index n -> StaticArray n a -> a
```

注目すべきは返り値の型です。

通常の配列では要素の型が `a` である配列の要素を取得する際の返り値の型が `Maybe a` になりますが、 StaticArray では返り値の型が `a` になるというメリットがあります。
これにより `Maybe` をハンドリングする必要がなくなるためよりシンプルに記述できます。

ここまででライブラリの概要を簡単に説明しました。

ここからは実際に使ってみて感じたことについて書いていきます。

## どんな場面で使ったか
趣味で開発している麻雀の点数集計アプリで使いました。

麻雀では一般的に 【最終的なスコア = 試合終了時の持ち点 + 順位に応じたボーナスポイント 】という形で試合(半荘と呼ぶ)ごとスコアを計算し、最後にその日のトータルのスコア(全試合のスコアを合計)します。

通常は 【試合終了時の持ち点 + 順位に応じたボーナスポイント】の計算を暗算して紙に書く、という方法が一般的です。ただ、このやり方だと計算に時間がかかりますし、当然計算ミスをする可能性もあります。そこで【試合終了時の持ち点】だけ入力すれば順位を計算し、順位に応じたボーナスポイントを加算した結果を表示してくれる、というアプリをつくりました。

半荘ごとの個人の素点を入力すると...

<img src='https://user-images.githubusercontent.com/49891479/144571507-4c7cf8ac-0a0e-4c49-bb69-3e5642c1ecd0.png' height=300/>

順位点を加味したポイントを表示してくれるというものです。

<img src='https://user-images.githubusercontent.com/49891479/144571797-b96d4ab2-a7d7-45c6-91aa-5a913e2d92ea.png' height=300/>

前提の説明が長くなってしまいましたが、簡単にまとめると **整数の配列を受け取って加工して整数の配列を返すアプリケーション** ということです。

ここで **参加者の名前** および **その試合の最終的なスコア** を `Array String` で、扱おうとすると以下のようになるわけですが、これだとあらゆる長さの配列をとることができてしまいます。

```elm
type Players = Array String

type Points = Array String
```

そこで StaticArray を用いることで型で配列の長さの情報を表現できるわけです。

```elm
type Players
    = StaticArray Index.Four Player

type Points
    = StaticArray Index.Four Point
```


<!-- ↓これいらないかも -->
ここからは実際に使ってみて感じたことを書いていきます。

<!-- TODO: 表現を改める -->
## 実際に使ってみてよかったところ
冒頭では以下のメリットがあると述べました。
- 配列の要素を get で取り出す際に Maybe をハンドリングする必要がない
<!-- コード上に仕様を表現しやすい とかの方がいいかも -->
- 仕様を型で表現しやすくなる

<!-- 注釈で動画リンクを貼りたい -->
<!-- 仕様上ありえない状態を表現できないようなコードを書くべきである、という指針 -->
上記以外にも実際に使ってみて、仕様上ありえない状態が存在できないコードが書きやすくなるのでバグや予期しない動作の可能性が減る というメリットもあると感じました。

たとえば以下は引数に取った値が既定値かどうかを判定する関数です。

仕様上 Points の長さは　4 もしくは 5 になるのですが、StaticArray を使うと以下のように書くことができます。

`isDefaultRound` 関数のパターンマッチの中では仕様上ありえる値の分岐だけを扱えばいいことがわかると思います。

```elm
type Round
    = Round4 Round4Value
    | Round5 Round5Value


type alias Round4Value =
    -- 長さが 4 の StaticArray
    { points : StaticArray Index.Four Point
    , seatingOrder : Maybe SeatingOrder
    , tobisho : StaticArray Index.Four Point
    }


type alias Round5Value =
    -- 長さが 5 の StaticArray
    { points : StaticArray Index.Five Point
    , seatingOrder : Maybe SeatingOrder
    , tobisho : StaticArray Index.Five Point
    }

isDefaultRound : Round -> Bool
isDefaultRound round =
    case round of
        Round4 _ ->
            round == initRound4

        Round5 _ ->
            round == initRound5
```

これを StaticArray を使わずに書いた場合は以下のように仕様上ありえないパターンを扱う必要があります。
<!-- ほんまか？ -->

```elm
isDefaultRound : Round -> Bool
isDefaultRound round =
    case Array.length round of
        4 ->
            round == initRound4

        5 ->
            round == initRound5

        _ ->
            False
```

<!-- もうちょい断定口調でもいいのか？ -->
このように仕様上ありえないパターンを扱う必要がないことでバグの可能性を減らすことができると感じました。


<!-- TODO: 表現を改める -->
## 微妙だったところ
逆に微妙だと感じたのは以下の点です。

- Array に定義されているすべての関数が定義されているわけではない
- StaticArray の書き方に慣れるまでは時間がかかる

それぞれ補足していきます。

また、 Array に生えている関数が StaticArray には生えてなかったりするので、都度 Array に変換して処理をした上で再度 StaticArray に変換する、というような工程が必要になる場面がありました。StaticArray には最小限の関数しか定義されていないので例えば `filter` や `foldl(foldr)` などは一度 Array などに変換し、処理をしてから再度 StaticArray に変換しなおす必要がありました。


- StaticArray の書き方に慣れるまでは時間がかかる

たとえばインデックスを指定して StaticArray の要素を取得する get 関数を使おうと[ドキュメント](https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/StaticArray#get)を見ると、下記のような記述があります。

```elm
-- Gets an element of the array. Note that it only possible if the index is in bound. Therefore eliminating Off-by-one errors.
get : Index n -> StaticArray n a -> a
```

自分の Elm 力のなさのせいではありますが、ドキュメントに具体的なコード例が示されていないこともあり動かすまでそれなりに試行錯誤が必要でした。(当時は GitHub で検索しても引っ掛からずに絶望していましたが、検索の仕方が悪かっただけだということにこの記事の執筆時に気付きました。)
実際には以下のような使い方をする必要があります。ちゃんと動くコードを書くのに　1h くらい費やしてしまいました。

```elm
data = StaticArray.get (Index.fromModBy Length.four 0) points
```

ただ逆に言えばネガティブに感じたのは上記の2点くらいで、基本的にはメリットの方が大きく感じたためこれからも必要であれば使っていきたいと思っています。

<!-- - fromList が `1 [2]` みたいな形で書かないといけないので面倒くさい -->
<!--   - 空ではない配列をつくりたいので仕方ないけども。( `1 []` みたいにかけてしまうので) -->

<!-- ## このライブラリを使わずともこういう方法で代替できるかもしれない -->
<!-- - ValidatedPoint 型をつくって 長さを確定させる -->
<!--   - 人間にとって仕様が理解しやすいみたいなところは満たせるかも -->
<!--   - ただ型としてわかっているわけではないので、 get は Maybe になる。 -->

<!-- 時間があったらかく -->
<!-- ## 内部実装について -->
<!--   - phantom type について理解できていると語れそう -->
<!--     > 固定長の配列を使用してください！すべてのチェックはコンパイル時に行われます。これは可能ですか？はい、そうです！魔法の言葉はファントムタイプです。(https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/ の冒頭より) -->

## まとめ
Elm で固定長配列を扱うためのライブラリ elm-static-array(以下 StaticArray) を触ってみて感じたことを書いてみました。

仕様を型で表現しやすくなるという点が一番大きいメリットだと感じていてかつデメリットも微々たるものだと感じているので、今後も必要なケースでは積極的に使っていきたいと感じました。



