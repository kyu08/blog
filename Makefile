.PHONY: new
new:
	@read -p "post id: " id; \
	hugo new "posts/$${id}/index.md"

.PHONY: run-watch
run-watch:
	hugo serve -w

.PHONY: run-ignore-cache
run-ignore-cache:
	hugo serve --ignoreCache
