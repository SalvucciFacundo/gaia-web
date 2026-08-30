package docs

import (
	"bytes"
	"strings"
	"testing"
)

func TestDocsService(t *testing.T) {
	svc := NewService()

	t.Run("returns all 18 documents", func(t *testing.T) {
		docs := svc.GetAllDocs()
		if len(docs) != 18 {
			t.Fatalf("expected 18 documents, got %d", len(docs))
		}
	})

	t.Run("returns ordered categories", func(t *testing.T) {
		categories := svc.GetCategories()
		if len(categories) != 5 {
			t.Fatalf("expected 5 categories, got %d", len(categories))
		}

		expectedCats := []string{
			"Getting Started",
			"Core Architecture",
			"Quality & Security",
			"Ecosystem & Extensibility",
			"Strategy & Roadmap",
		}

		for i, cat := range categories {
			if cat.Name != expectedCats[i] {
				t.Errorf("expected category %d to be %s, got %s", i, expectedCats[i], cat.Name)
			}
			if len(cat.Docs) == 0 {
				t.Errorf("category %s has no docs", cat.Name)
			}
		}
	})

	t.Run("parses each document successfully", func(t *testing.T) {
		for _, meta := range svc.GetAllDocs() {
			doc, err := svc.GetDoc(meta.Slug)
			if err != nil {
				t.Fatalf("failed to load doc %s: %v", meta.Slug, err)
			}

			if doc.Metadata.Title == "" {
				t.Errorf("doc %s has empty title", meta.Slug)
			}

			if doc.RawMarkdown == "" {
				t.Errorf("doc %s has empty raw markdown", meta.Slug)
			}

			if doc.HTML == "" {
				t.Errorf("doc %s has empty rendered HTML", meta.Slug)
			}

			// Verify HTML contains basic elements
			htmlStr := string(doc.HTML)
			if !strings.Contains(htmlStr, "<") || !strings.Contains(htmlStr, ">") {
				t.Errorf("doc %s does not contain valid HTML tags", meta.Slug)
			}
		}
	})

	t.Run("transforms mermaid codeblocks into div.mermaid", func(t *testing.T) {
		testMarkdown := []byte("```mermaid\nflowchart TD\n  A[Start] --> B[End]\n```")
		var buf bytes.Buffer
		if err := svc.markdown.Convert(testMarkdown, &buf); err != nil {
			t.Fatalf("failed to convert markdown: %v", err)
		}

		result := postProcessHTML(buf.String())
		if !strings.Contains(result, "<div class=\"mermaid\">") {
			t.Errorf("expected result to contain '<div class=\"mermaid\">', got:\n%s", result)
		}
		if !strings.Contains(result, "flowchart TD") {
			t.Errorf("expected result to contain 'flowchart TD', got:\n%s", result)
		}
	})

	t.Run("returns prev and next navigation", func(t *testing.T) {
		firstDoc, err := svc.GetDoc("cli")
		if err != nil {
			t.Fatal(err)
		}
		if firstDoc.Prev != nil {
			t.Errorf("expected first doc to have nil Prev, got %v", firstDoc.Prev)
		}
		if firstDoc.Next == nil || firstDoc.Next.Slug != "tui-commands" {
			t.Errorf("expected first doc Next to be tui-commands, got %v", firstDoc.Next)
		}

		lastDoc, err := svc.GetDoc("pending-implementations")
		if err != nil {
			t.Fatal(err)
		}
		if lastDoc.Next != nil {
			t.Errorf("expected last doc to have nil Next, got %v", lastDoc.Next)
		}
		if lastDoc.Prev == nil || lastDoc.Prev.Slug != "hermes-commands-review" {
			t.Errorf("expected last doc Prev to be hermes-commands-review, got %v", lastDoc.Prev)
		}
	})

	t.Run("returns error for unknown slug", func(t *testing.T) {
		_, err := svc.GetDoc("non-existent-slug")
		if err == nil {
			t.Error("expected error for unknown slug, got nil")
		}
	})
}
