.PHONY: all build clean dev templ css tools run test sync-docs

TAILWIND_VERSION ?= v3.4.17
OS := $(shell uname -s | tr '[:upper:]' '[:lower:]')
ARCH := $(shell uname -m)

ifeq ($(ARCH),x86_64)
	TAILWIND_ARCH := x64
else ifeq ($(ARCH),aarch64)
	TAILWIND_ARCH := arm64
else ifeq ($(ARCH),arm64)
	TAILWIND_ARCH := arm64
else
	TAILWIND_ARCH := x64
endif

ifeq ($(OS),darwin)
	TAILWIND_BIN_NAME := tailwindcss-macos-$(TAILWIND_ARCH)
else ifeq ($(OS),windows)
	TAILWIND_BIN_NAME := tailwindcss-windows-$(TAILWIND_ARCH).exe
else
	TAILWIND_BIN_NAME := tailwindcss-linux-$(TAILWIND_ARCH)
endif

TAILWIND_CLI := ./bin/tailwindcss

all: build

tools:
	@mkdir -p bin
	@if [ ! -f $(TAILWIND_CLI) ]; then \
		echo "Downloading Tailwind Standalone CLI ($(TAILWIND_VERSION))..."; \
		curl -sL https://github.com/tailwindlabs/tailwindcss/releases/download/$(TAILWIND_VERSION)/$(TAILWIND_BIN_NAME) -o $(TAILWIND_CLI); \
		chmod +x $(TAILWIND_CLI); \
	fi

sync-docs:
	@mkdir -p internal/docs/docs
	@cp -r docs/* internal/docs/docs/ 2>/dev/null || true

templ:
	@echo "Generating Templ components..."
	@templ generate

css: tools
	@echo "Compiling Tailwind CSS..."
	@$(TAILWIND_CLI) -i ./src/input.css -o ./static/css/styles.css --minify

css-dev: tools
	@echo "Watching Tailwind CSS..."
	@$(TAILWIND_CLI) -i ./src/input.css -o ./static/css/styles.css --watch

build: sync-docs templ css
	@echo "Building Go server..."
	@go build -ldflags="-s -w" -o bin/server ./cmd/server

run: build
	@echo "Starting server on http://localhost:8080..."
	@./bin/server

test: sync-docs
	@echo "Running tests..."
	@go test -v ./...

clean:
	@rm -rf bin/server static/css/styles.css
	@find internal/views -name "*_templ.go" -delete
