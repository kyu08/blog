.PHONY: new
new:
	@read -p "post id: " id; \
	hugo new "posts/$${id}/index.md"
