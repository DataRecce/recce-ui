.PHONY: help sync sync-branch build type-check clean install

# Default target
help:
	@echo "Recce UI - Available targets:"
	@echo ""
	@echo "  sync          Sync submodule to latest main and update dependencies"
	@echo "  sync-branch   Sync submodule to specific branch (usage: make sync-branch BRANCH=feature/xyz)"
	@echo "  install       Install dependencies"
	@echo "  build         Build the package"
	@echo "  type-check    Run TypeScript type checking"
	@echo "  clean         Clean build artifacts"
	@echo "  verify        Run sync + build + type-check"
	@echo ""

# Sync submodule to latest main branch and update dependencies
sync:
	@./scripts/sync-submodule.sh

# Sync submodule to specific branch
sync-branch:
	@./scripts/sync-submodule.sh --branch $(BRANCH)

# Install dependencies
install:
	pnpm install

# Build the package
build:
	pnpm build

# Run type checking
type-check:
	pnpm type:check

# Run all type checking including OSS errors
type-check-all:
	pnpm type:check:all

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules/.cache

# Full rebuild
rebuild: clean build

# Verify everything works
verify: sync build type-check
	@echo ""
	@echo "All checks passed!"
