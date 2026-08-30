package handlers

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/SalvucciFacundo/gaia-web/internal/docs"
)

func TestDocsHandlers(t *testing.T) {
	docsSvc := docs.NewService()
	handler := NewDocsHandler(docsSvc)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /docs", handler.ServeDocs)
	mux.HandleFunc("GET /docs/{slug}", handler.ServeDocSlug)

	t.Run("redirects /docs to /docs/cli", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/docs", nil)
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusFound {
			t.Fatalf("expected status 302, got %d", rec.Code)
		}

		location := rec.Header().Get("Location")
		if location != "/docs/cli" {
			t.Errorf("expected location /docs/cli, got %s", location)
		}
	})

	t.Run("renders /docs/cli successfully", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/docs/cli", nil)
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", rec.Code)
		}

		body := rec.Body.String()
		expectedKeywords := []string{
			"CLI Commands",
			"Documentation",
			"Getting Started",
		}

		for _, kw := range expectedKeywords {
			if !strings.Contains(body, kw) {
				t.Errorf("expected body to contain '%s'", kw)
			}
		}
	})

	t.Run("renders /docs/sdd successfully", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/docs/sdd", nil)
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", rec.Code)
		}

		body := rec.Body.String()
		if !strings.Contains(body, "Spec-Driven Development") {
			t.Errorf("expected body to contain 'Spec-Driven Development'")
		}
	})

	t.Run("returns 404 for unknown slug", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/docs/unknown-doc-slug", nil)
		rec := httptest.NewRecorder()

		mux.ServeHTTP(rec, req)

		if rec.Code != http.StatusNotFound {
			t.Fatalf("expected status 404, got %d", rec.Code)
		}
	})
}
