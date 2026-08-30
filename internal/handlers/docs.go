package handlers

import (
	"net/http"

	"github.com/SalvucciFacundo/gaia-web/internal/docs"
	views_docs "github.com/SalvucciFacundo/gaia-web/internal/views/docs"
)

type DocsHandler struct {
	docsSvc *docs.Service
}

func NewDocsHandler(docsSvc *docs.Service) *DocsHandler {
	return &DocsHandler{
		docsSvc: docsSvc,
	}
}

// ServeDocs handles GET /docs by redirecting to the first document (/docs/cli)
func (h *DocsHandler) ServeDocs(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/docs/cli", http.StatusFound)
}

// ServeDocSlug handles GET /docs/{slug}
func (h *DocsHandler) ServeDocSlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	if slug == "" {
		http.Redirect(w, r, "/docs/cli", http.StatusFound)
		return
	}

	doc, err := h.docsSvc.GetDoc(slug)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	categories := h.docsSvc.GetCategories()

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_ = views_docs.Page(doc, categories).Render(r.Context(), w)
}
