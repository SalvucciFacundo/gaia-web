# ─── Stage 1: Build & Assets ───
FROM golang:alpine AS builder

# Install build dependencies
RUN apk add --no-cache curl make ca-certificates git

WORKDIR /build

# Install Templ compiler
RUN go install github.com/a-h/templ/cmd/templ@latest

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code and configuration
COPY . .

# Generate Docs, Templ and CSS
RUN make tools
RUN make sync-docs
RUN make templ
RUN make css

# Build static Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w -extldflags '-static'" -o /build/bin/server ./cmd/server

# ─── Stage 2: Runtime Image ───
FROM alpine:3.21

# Install CA certificates and tzdata for secure HTTPS and correct timezone
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy binary from builder
COPY --from=builder --chown=appuser:appgroup /build/bin/server /app/server

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["/app/server"]
