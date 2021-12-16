---
title: 'Elm で固定長配列が扱えるライブラリ elm-static-array を触ってみた'
published: '2021-12-18'
---

Elm で固定長配列を扱うためのライブラリ elm-static-array を触ってみたので感じたことを書いていきます。

## elm-static-array とは
<!-- 全部 elm-static-array って書いた方がいいかな -->
[elm-static-array](https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/) は Elm で固定長配列を扱うためのライブラリです。

配列の長さを型で表現できることが特徴です。

```elm
-- StaticArray
-- 長さ 4 の配列
arrayLength4 : StaticArray Index.Four String

-- 通常の Array
ordinaryArray : Array String
```

## どんな場面で使ったか
趣味で開発している麻雀の点数集計アプリで使いました。

各プレイヤーの試合毎のスコアを記録して合計を表示するだけの簡単なアプリケーションです。(※実際には順位点やトビ賞の計算などもやっていますがここでは割愛)

<img src='https://user-images.githubusercontent.com/49891479/144793092-395b5cfb-fa54-43b7-9ec5-7926ccbbb647.png' height=300/>

ここで **参加者の名前** および **その試合のスコア** を `Array String` として扱おうとすると以下のようになります。

```elm
type alias Players = Array String

type alias Points = Array String
```

これではあらゆる長さの配列をとることができてしまいますが、仕様上どちらも長さ 4 もしくは 5 の配列しかとることはありません。
そこで elm-static-array を使って配列の長さの情報を型で表現しました。

```elm
type Players
    = Players4 (StaticArray Index.Four Player)
    | Players5 (StaticArray Index.Five Player)

type Points
    = Points4 (StaticArray Index.Four Point)
    | Points5 (StaticArray Index.Five Point)
```


<br>
<br>
ここからは実際に使ってみて感じたことを書いていきます。
<br>
<br>

## elm-static-array を使うことで得られるメリット
### メリット①：仕様を型で表現しやすい
上でも触れましたが、長さが 4 もしく 5 の `Point` の配列は elm-static-array を使うと以下のように定義できます。

```elm
type Points
    = Points4 (StaticArray Index.Four Point)
    | Points5 (StaticArray Index.Five Point)
```

elm-static-array を使うことで型に配列の長さの情報を持たせることができるため、**仕様を型で表現しやすくなり**コードの可読性向上に繋がります。

<!-- 注釈で動画リンクを貼りたい -->
<!-- 仕様上ありえない状態を表現できないようなコードを書くべきである、という指針 -->
また、それにともなって **仕様上ありえない状態が存在できないコードを書きやすくなる**ため**バグの可能性を減らす** ことができます。

たとえば以下の `isDefaultRound`関数 は引数に取った値がデフォルト値かどうかを判定する関数です。

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

仕様上 `Points` の長さは 4 もしくは 5 になるのですが、elm-static-array を使って書くと `isDefaultRound`関数 のパターンマッチの中では仕様上ありえる値の分岐だけを扱えばいいことがわかると思います。

これを elm-static-array を使わずに書いた場合は以下のように仕様上ありえないパターンを扱う必要があります。

```elm
isDefaultRound : Round -> Bool
isDefaultRound round =
    case Array.length round.points of
        4 ->
            round == initRound4

        5 ->
            round == initRound5

        _ ->
            False
```

elm-static-array を使うことで仕様上ありえないパターンを扱う必要がなくなりバグの可能性を減らすことができます。

### メリット②：配列の要素を取得する際に `Maybe` をハンドリングする必要がない
配列の要素を取得する際も通常の Array との違いを感じることができます。

以下は配列の要素を取得する `get` 関数の型定義です。

```elm
-- 通常の配列
get : Int -> Array a -> Maybe a

-- StaticArray
get : Index n -> StaticArray n a -> a
```

注目すべきは **返り値の型** です。

通常の配列では要素の型が `a` である配列の要素を取得する際の返り値の型が `Maybe a` になりますが、 elm-static-array では返り値の型が `a` になります。
これにより **`Maybe` をハンドリングする必要がなくなるためよりシンプルに記述できます。** 

## 懸念点
逆に懸念だと感じたのは以下の2つです。

- Array に定義されているすべての関数が定義されているわけではない
- elm-static-array の書き方に慣れるまでは時間がかかる

それぞれ補足していきます。

### 懸念①：Array に定義されているすべての関数が定義されているわけではない

Array に生えている関数が StaticArray には生えてなかったりするので、都度 Array に変換して処理をした上で再度 StaticArray に変換する、というような工程が必要になる場面がありました。StaticArray には最小限の関数しか定義されていないので例えば `filter` や `foldl(foldr)` などは一度 Array などに変換し、処理してから再度 StaticArray に変換しなおす必要がありました。

以下は StaticArray を Array に変換して filter して StaticArray に戻すコード例です。

`StaticArray.fromList` が head と tail を引数に取るため若干コード量が増えてしまいます。

head の要素を取り出す際に Nothing をハンドリングしなければならないのがちょっと億劫ですね。(もちろんコンパイラは StaticArray から変換された Array であることなど知るよしもないので仕方ないのですが)

```elm
filterStaticArray : StaticArray Index.Four String -> StaticArray Index.Four String
filterStaticArray staticArray =
    let
        filteredArray =
            staticArray
                |> StaticArray.toArray
                |> Array.filter ((/=) "")

        head =
            Maybe.withDefault "undefined" <|
                Array.get
                    0
                    filteredArray

        tail =
            filteredArray
                |> Array.slice 1 (Array.length filteredArray)
                |> Array.toList
    in
    StaticArray.fromList
        Length.four
        head
        tail
```

### 懸念②：StaticArray の書き方に慣れるまでは時間がかかる
たとえばインデックスを指定して StaticArray の要素を取得する get 関数を使おうと[ドキュメント](https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/StaticArray#get)を見ると、下記のような記述があります。

```elm
-- Gets an element of the array. Note that it only possible if the index is in bound. Therefore eliminating Off-by-one errors.
get : Index n -> StaticArray n a -> a
```

自分のElm力の乏しさのせいではありますがドキュメントに具体的なコード例が示されていないこともあり、動かすまでにそれなりの試行錯誤が必要でした。(当時は GitHub で検索しても引っ掛からずに絶望していましたが、検索の仕方が悪かっただけだということに執筆時に気付きました。)
実際には以下のような使い方をする必要があります。ちゃんと動くコードを書くのに　1h くらい費やしてしまいました。

```elm
head : Element
head = StaticArray.get (Index.fromModBy Length.four 0) someStaticArray
```

まとめると、 **多少の手間が必要になる** ということかなと思います。
このあたりが elm-static-array の作者が [README](https://package.elm-lang.org/packages/Orasund/elm-static-array/latest/) の中で以下のように言っている所以かなと感じました。

> Construction is a bit slower (should be neglectable for most cases).


ただ逆に言えばネガティブに感じたのは上記のそれくらいで、基本的にはメリットの方が大きく感じたためこれからも必要であれば使っていきたいと思っています。

## まとめ
Elm で固定長配列を扱うためのライブラリ elm-static-array を触った感想を書いてみました。

仕様を型で表現しやすくなるという点に魅力を感じたので今後も必要なケースでは積極的に使っていきたいと思います。

また、ひさびさに個人開発をして、なかなか時間が取れずコードの意図や全体像をよく忘れたりするので個人開発においても可読性が高かったり意図の伝わりやすいコードを書くことの重要性が身に染みました。

時間がなかなかとれないからこそ質の高いコードを意識的に書いていきたいなと思います。
