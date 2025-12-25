#!/bin/bash

if [[ -z "$1" ]]; then
  echo "Usage: $0 <year>" >&2
  exit 1
fi

year="$1"

for dir in content/posts/*/; do
  file="${dir}index.md"
  if [[ -f "$file" ]]; then
    # フロントマターからdateとtitleを抽出
    date=$(grep -m1 '^date:' "$file" | sed 's/date: *//' | tr -d '"')
    title=$(grep -m1 '^title:' "$file" | sed 's/title: *//' | tr -d '"')

    # 指定された年の記事のみ出力
    if [[ "$date" == ${year}* ]]; then
      slug=$(basename "$dir")
      echo "${date}	- [$title](https://blog.kyu08.com/posts/$slug/)"
    fi
  fi
done | sort | cut -f2-
