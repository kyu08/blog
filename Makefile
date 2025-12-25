.PHONY: init
init:
	@git submodule update --init --recursive

.PHONY: new
new:
	@read -p "post id: " id; \
	git checkout -b "$${id}"; \
	hugo new "posts/$${id}/index.md"

.PHONY: run-watch
run-watch:
	hugo serve -w

.PHONY: run-ignore-cache
run-ignore-cache:
	hugo serve --ignoreCache

.PHONY: compress-to-webp
compress-to-webp:
	@scripts/compress-to-webp.sh

.PHONY: lint
lint:
	npx textlint ./content/posts/**/*.md

.PHONY: lint-fix
lint-fix:
	npx textlint --fix ./content/posts/**/*.md

# usage: make list-posts year=2025
.PHONY: list-posts
list-posts:
	@scripts/list-posts-by-year.sh $(year)
