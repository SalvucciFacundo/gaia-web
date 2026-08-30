package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthHandler(t *testing.T) {
	handler := NewHealthHandler("2.0.0")
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", rec.Code)
	}

	contentType := rec.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf("expected Content-Type application/json, got %s", contentType)
	}

	var resp HealthResponse
	if err := json.NewDecoder(rec.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode json response: %v", err)
	}

	if resp.Status != "ok" || resp.App != "gaia-web" || resp.Version != "2.0.0" {
		t.Errorf("unexpected response content: %+v", resp)
	}
}

func TestHomeHandler(t *testing.T) {
	handler := NewHomeHandler()

	t.Run("renders home page successfully", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()

		handler.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			t.Fatalf("expected status 200, got %d", rec.Code)
		}

		body := rec.Body.String()
		expectedStrings := []string{
			"GAIA",
			"Go Autonomous Intelligence Agent",
			"12+ Specialized Subagents",
			"Hexagonal",
			"Quick Start",
		}

		for _, str := range expectedStrings {
			if !strings.Contains(body, str) {
				t.Errorf("expected body to contain '%s'", str)
			}
		}
	})

	t.Run("returns 404 for non-root path", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/non-existent", nil)
		rec := httptest.NewRecorder()

		handler.ServeHTTP(rec, req)

		if rec.Code != http.StatusNotFound {
			t.Fatalf("expected status 404, got %d", rec.Code)
		}
	})
}
