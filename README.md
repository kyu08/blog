> [!NOTE]
> clone直後に一度`make init`を実行する必要がある(git submoduleとして管理しているhugo themeのcloneが必要なため)
> 
> あとは`Makefile`参照のこと

## 必要なツールのインストール
```sh
brew install hugo # hugo v0.115.1 darwin/arm64 BuildDate=unknown
brew install sass/sass/sass # 1.83.0
npm ci
```
