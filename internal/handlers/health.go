package handlers

import (
	"encoding/json"
	"net/http"
	"time"
)

type HealthResponse struct {
	Status    string `json:"status"`
	App       string `json:"app"`
	Version   string `json:"version"`
	Timestamp string `json:"timestamp"`
}

type HealthHandler struct {
	version string
}

func NewHealthHandler(version string) *HealthHandler {
	return &HealthHandler{version: version}
}

func (h *HealthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	resp := HealthResponse{
		Status:    "ok",
		App:       "gaia-web",
		Version:   h.version,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(resp)
}
