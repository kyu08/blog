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
	@./compress-to-webp.sh
