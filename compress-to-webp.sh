#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# fzfで対象のディレクトリを選択する
TARGET=$(find ./content/posts -type d | fzf --prompt="Select a directory: " --preview="ls -l {}")

# webpに変換
for file in $TARGET/*.{jpg,jpeg,png,JPG,JPEG,PNG};
  do if [[ "$file" != *"*.png" && "$file" != *"*.jpg" && "$file" != *"*.jpeg" && "$file" != *"*.PNG" && "$file" != *"*.JPG" && "$file" != *"*.JPEG" ]]; then
    cwebp "$file" -o "${file%.*}.webp"
  fi;
done
