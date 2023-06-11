#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# fzfでディレクトリを選択する
TARGET=$(find ./content/posts -type d | fzf --prompt="Select a directory: " --preview="ls -l {}")

# if [ -n "$TARGET" ]; then
#   echo "Selected directory: $TARGET"
# else
#   echo "No directory selected."; exit 1;
# fi

# webpに変換
for file in $TARGET/*.{jpg,jpeg,png};
  do if [[ "$file" != *"*.png" && "$file" != *"*.jpg" && "$file" != *"*.jpeg" ]]; then
    cwebp "$file" -o "${file%.*}.webp"
  fi;
done

