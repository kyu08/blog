---
title: "Goのprevent comparabilityについて知った"
tags: ["", ""]
keywords: ["", ""]

cover: "https://blog.kyu08.com/cover.png"
description: ""
date: 2024-08-08T00:03:54+09:00
author: "kyu08"
authorTwitter: "kyu08_"
draft: false
showFullContent: false
readingTime: true
hideComments: false
color: ""
---


<!-- TODO: 記事のメタデータを埋める -->
<!-- TODO: なぜ初期化できないのか追記する。（`_`フィールドの仕様） -->
<!-- TODO: なぜ比較できないのか追記する。（func()がcomparableじゃないから(参考になるかもしれないリンク: https://go.dev/ref/spec#Comparison_operators )） -->
<!-- TODO: ↑それぞれ公式ソースを探す -->


slogのコードを眺めていたら出てきた。 https://github.com/golang/go/blob/e705a2d16e4ece77e08e80c168382cdb02890f5b/src/log/slog/value.go#L22

```go
type Value struct {
	_ [0]func() // disallow ==
	// num holds the value for Kinds Int64, Uint64, Float64, Bool and Duration,
	// the string length for KindString, and nanoseconds since the epoch for KindTime.
	num uint64
	// If any is of type Kind, then the value is in num as described above.
	// If any is of type *time.Location, then the Kind is Time and time.Time value
	// can be constructed from the Unix nanos in num and the location (monotonic time
	// is not preserved).
	// If any is of type stringptr, then the Kind is String and the string value
	// consists of the length in num and the pointer in any.
	// Otherwise, the Kind is Any and any is the value.
	// (This implies that Attrs cannot store values of type Kind, *time.Location
	// or stringptr.)
	any any
}
```

- ローカルの環境に構造体定義をコピーしてきて動かしてみた。
- そもそも初期化することができない。
- `==`で比較しようとするとエラーになる。

```go
package main

import "fmt"

func main() {
	v1 := Value{
		_:   [0]func(){}, // unknown field _ in struct literal of type Value
		num: 0,
		any: nil,
	}
	v2 := Value{
		_:   nil,
		num: 0,
		any: nil,
	}

	fmt.Println(v1 == v2) // invalid operation: v1 == v2 (struct containing [0]func() cannot be compared)
}

type Value struct {
	_ [0]func() // disallow ==
	// num holds the value for Kinds Int64, Uint64, Float64, Bool and Duration,
	// the string length for KindString, and nanoseconds since the epoch for KindTime.
	num uint64
	// If any is of type Kind, then the value is in num as described above.
	// If any is of type *time.Location, then the Kind is Time and time.Time value
	// can be constructed from the Unix nanos in num and the location (monotonic time
	// is not preserved).
	// If any is of type stringptr, then the Kind is String and the string value
	// consists of the length in num and the pointer in any.
	// Otherwise, the Kind is Any and any is the value.
	// (This implies that Attrs cannot store values of type Kind, *time.Location
	// or stringptr.)
	any any
}
```
## 参考
https://stackoverflow.com/questions/71031243/how-does-type-donotcompare-0func-prevent-comparability-in-golang
