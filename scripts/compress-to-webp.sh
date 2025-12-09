#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# fzfで対象のディレクトリを選択する
TARGET=$(find ./content/posts -type d | fzf --prompt="Select a directory: " --preview="ls -l {}")

# webpに変換
for file in "$TARGET"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  # ファイルが存在しない場合（globがマッチしなかった場合）はスキップ
  [[ -e "$file" ]] || continue
  # cover.pngは対象外
  [[ "$(basename "$file")" == "cover.png" ]] && continue

  # NOTE: imagemagickのインストールが必要
  # -auto-orientをつけないと画像の向きが正しくならないことがある
  magick "$file" -auto-orient -format webp "${file%.*}.webp"
done
