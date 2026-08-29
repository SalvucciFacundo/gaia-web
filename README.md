# GAIA Web — Landing Page

> Lightweight, high-performance landing page for **[GAIA](https://github.com/SalvucciFacundo/gaia)** built with Go, Templ, HTMX, and Tailwind CSS. Single binary, zero Node.js dependencies.

---

## ⚡ Highlights

- **Single Static Binary:** Embeds all HTML, compiled CSS, and JS assets using Go's `embed.FS`.
- **Zero Node.js Dependency:** Uses the official Tailwind CSS Standalone CLI for CSS purging and minification.
- **Ultra Lightweight & Fast:** Sub-millisecond response times (~300µs), <15MB RAM footprint, and <20MB Docker container.
- **Type-Safe Templating:** Pre-compiled HTML components with [Templ](https://templ.guide).
- **Production-Ready for Dokploy:** Includes a multi-stage `Dockerfile` with healthcheck endpoints (`/health` and `/healthz`).

---

## 🛠️ Tech Stack

- **Backend:** Go 1.24+ standard library `net/http`
- **Templates:** [Templ](https://github.com/a-h/templ)
- **Styling:** [Tailwind CSS Standalone CLI](https://tailwindcss.com/blog/standalone-cli)
- **Frontend Interactivity:** [HTMX](https://htmx.org) + Vanilla JS
- **Deployment:** Docker / Dokploy

---

## 🚀 Quick Start

### Prerequisites

- [Go](https://go.dev/) 1.22+
- [Templ CLI](https://templ.guide/quick-start/installation/): `go install github.com/a-h/templ/cmd/templ@latest`
- `make` and `curl`

### Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SalvucciFacundo/gaia-web.git
   cd gaia-web
   ```

2. **Run locally:**
   ```bash
   make run
   ```
   *This automatically downloads the Tailwind Standalone CLI, compiles Templ files, builds CSS, and starts the server on `http://localhost:8080`.*

3. **Run tests:**
   ```bash
   make test
   ```

---

## 📦 Makefile Commands

| Command | Description |
|---|---|
| `make run` | Builds assets and runs the server locally |
| `make build` | Generates Templ and minified CSS, builds `bin/server` |
| `make templ` | Compiles `.templ` files to Go |
| `make css` | Minifies Tailwind CSS with Standalone CLI |
| `make css-dev` | Watches and rebuilds Tailwind CSS on changes |
| `make test` | Runs unit tests |
| `make clean` | Cleans build artifacts |

---

## 🐳 Docker & Dokploy Deployment

The repository includes a multi-stage `Dockerfile`:

```bash
docker build -t gaia-web .
docker run -p 8080:8080 gaia-web
```

In Dokploy, create an application pointing to this Git repository using Dockerfile build type.

---

## 📄 License

MIT License © [Facundo Salvucci](https://github.com/SalvucciFacundo)
