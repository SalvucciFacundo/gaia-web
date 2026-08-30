package docs

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"strings"
	"sync"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)

//go:embed docs/*.md
var embeddedDocs embed.FS

type DocMetadata struct {
	Slug        string
	FileName    string
	Title       string
	Description string
	Category    string
	Icon        string
	Order       int
}

type DocCategory struct {
	Name string
	Icon string
	Docs []DocMetadata
}

type Doc struct {
	Metadata    DocMetadata
	RawMarkdown string
	HTML        template.HTML
	Prev        *DocMetadata
	Next        *DocMetadata
}

type Service struct {
	markdown goldmark.Markdown
	docsMap  map[string]DocMetadata
	docList  []DocMetadata
	cache    sync.Map
}

var (
	registry = []DocMetadata{
		// 1. Getting Started
		{
			Slug:        "cli",
			FileName:    "cli.md",
			Title:       "CLI Commands",
			Description: "Guía completa de todos los comandos de terminal de GAIA.",
			Category:    "Getting Started",
			Icon:        "⚡",
			Order:       1,
		},
		{
			Slug:        "tui-commands",
			FileName:    "tui-commands.md",
			Title:       "TUI & In-Session",
			Description: "Atajos de teclado, comandos slash y navegación en la Cyberpunk TUI.",
			Category:    "Getting Started",
			Icon:        "🖥️",
			Order:       2,
		},
		{
			Slug:        "configuration",
			FileName:    "configuration.md",
			Title:       "Configuration",
			Description: "Referencia de configuración global, por proyecto y variables de entorno.",
			Category:    "Getting Started",
			Icon:        "⚙️",
			Order:       3,
		},

		// 2. Core Architecture
		{
			Slug:        "architecture",
			FileName:    "architecture.md",
			Title:       "Hexagonal Architecture",
			Description: "Estructura interna en Go: puertos, adaptadores y topología de binario único.",
			Category:    "Core Architecture",
			Icon:        "🏗️",
			Order:       4,
		},
		{
			Slug:        "sdd",
			FileName:    "sdd.md",
			Title:       "Spec-Driven Development",
			Description: "Pipeline de 8 fases estructuradas: desde exploración hasta archivo del cambio.",
			Category:    "Core Architecture",
			Icon:        "📋",
			Order:       5,
		},
		{
			Slug:        "subagents",
			FileName:    "subagents.md",
			Title:       "Subagent System",
			Description: "Los 12+ subagentes autónomos, namespaces de memoria y generación dinámica.",
			Category:    "Core Architecture",
			Icon:        "🤖",
			Order:       6,
		},
		{
			Slug:        "context-layers",
			FileName:    "context-layers.md",
			Title:       "Context Management",
			Description: "Capas de contexto jerárquico y compresión para eficiencia de tokens.",
			Category:    "Core Architecture",
			Icon:        "📚",
			Order:       7,
		},
		{
			Slug:        "token-efficiency",
			FileName:    "token-efficiency.md",
			Title:       "Token Efficiency & KG",
			Description: "Knowledge Graph de 3 ámbitos y técnicas avanzadas de ahorro de contexto.",
			Category:    "Core Architecture",
			Icon:        "🧠",
			Order:       8,
		},

		// 3. Quality & Security
		{
			Slug:        "review",
			FileName:    "review.md",
			Title:       "BR Code Review",
			Description: "Sistema Bounded Review de 4 lentes con recibos criptográficos SHA256.",
			Category:    "Quality & Security",
			Icon:        "👁️",
			Order:       9,
		},
		{
			Slug:        "security",
			FileName:    "security.md",
			Title:       "Security & PolicyGuard",
			Description: "Tiers de permisos de ejecución (read/sandbox/full) y auditoría AST.",
			Category:    "Quality & Security",
			Icon:        "🛡️",
			Order:       10,
		},

		// 4. Ecosystem & Extensibility
		{
			Slug:        "skills",
			FileName:    "skills.md",
			Title:       "Skills Hub & Registry",
			Description: "Gestión, instalación y creación automática de skills para agentes.",
			Category:    "Ecosystem & Extensibility",
			Icon:        "🧩",
			Order:       11,
		},
		{
			Slug:        "plugins",
			FileName:    "plugins.md",
			Title:       "Plugin Architecture",
			Description: "Sistema de plugins y extensiones modulares para GAIA.",
			Category:    "Ecosystem & Extensibility",
			Icon:        "🔌",
			Order:       12,
		},
		{
			Slug:        "design-system",
			FileName:    "design-system.md",
			Title:       "Cyberpunk Design System",
			Description: "Paleta de colores, tokens de Lipgloss y componentes visuales de la TUI.",
			Category:    "Ecosystem & Extensibility",
			Icon:        "🎨",
			Order:       13,
		},
		{
			Slug:        "persona",
			FileName:    "persona.md",
			Title:       "Persona System",
			Description: "Configuración de personalidades, tono y estilo de respuesta del agente.",
			Category:    "Ecosystem & Extensibility",
			Icon:        "🎭",
			Order:       14,
		},

		// 5. Strategy & Roadmap
		{
			Slug:        "roadmap",
			FileName:    "roadmap.md",
			Title:       "Project Roadmap",
			Description: "Hitos cumplidos y próximos pasos en la evolución de GAIA.",
			Category:    "Strategy & Roadmap",
			Icon:        "🗺️",
			Order:       15,
		},
		{
			Slug:        "unified-architecture",
			FileName:    "unified-architecture.md",
			Title:       "Unified Gateway",
			Description: "Propuesta de arquitectura unificada para gateways multi-plataforma.",
			Category:    "Strategy & Roadmap",
			Icon:        "🌐",
			Order:       16,
		},
		{
			Slug:        "hermes-commands-review",
			FileName:    "hermes-commands-review.md",
			Title:       "Hermes Gap Analysis",
			Description: "Comparativa de comandos y capacidades frente a Hermes Agent.",
			Category:    "Strategy & Roadmap",
			Icon:        "🔍",
			Order:       17,
		},
		{
			Slug:        "pending-implementations",
			FileName:    "pending-implementations.md",
			Title:       "Pending Implementations",
			Description: "Registro de features en desarrollo y backlog de mejoras.",
			Category:    "Strategy & Roadmap",
			Icon:        "⏳",
			Order:       18,
		},
	}
)

func NewService() *Service {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.Table,
			extension.TaskList,
			extension.Strikethrough,
			extension.Linkify,
			extension.Typographer,
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithHardWraps(),
			html.WithXHTML(),
			html.WithUnsafe(),
		),
	)

	docsMap := make(map[string]DocMetadata, len(registry))
	for _, doc := range registry {
		docsMap[doc.Slug] = doc
	}

	return &Service{
		markdown: md,
		docsMap:  docsMap,
		docList:  registry,
	}
}

func (s *Service) GetAllDocs() []DocMetadata {
	return s.docList
}

func (s *Service) GetCategories() []DocCategory {
	categoryOrder := []struct {
		name string
		icon string
	}{
		{"Getting Started", "🚀"},
		{"Core Architecture", "🏗️"},
		{"Quality & Security", "🛡️"},
		{"Ecosystem & Extensibility", "🧩"},
		{"Strategy & Roadmap", "🗺️"},
	}

	catMap := make(map[string][]DocMetadata)
	for _, doc := range s.docList {
		catMap[doc.Category] = append(catMap[doc.Category], doc)
	}

	categories := make([]DocCategory, 0, len(categoryOrder))
	for _, co := range categoryOrder {
		if docs, ok := catMap[co.name]; ok {
			categories = append(categories, DocCategory{
				Name: co.name,
				Icon: co.icon,
				Docs: docs,
			})
		}
	}

	return categories
}

func (s *Service) GetDoc(slug string) (*Doc, error) {
	if cached, ok := s.cache.Load(slug); ok {
		return cached.(*Doc), nil
	}

	meta, ok := s.docsMap[slug]
	if !ok {
		return nil, fmt.Errorf("document not found: %s", slug)
	}

	rawBytes, err := embeddedDocs.ReadFile("docs/" + meta.FileName)
	if err != nil {
		return nil, fmt.Errorf("failed to read embedded doc %s: %w", meta.FileName, err)
	}

	var buf bytes.Buffer
	if err := s.markdown.Convert(rawBytes, &buf); err != nil {
		return nil, fmt.Errorf("failed to parse markdown for %s: %w", slug, err)
	}

	// Post-process HTML for styling (classes on tables, pre/code blocks, links)
	htmlStr := buf.String()
	htmlStr = postProcessHTML(htmlStr)

	// Calculate Prev / Next
	var prev *DocMetadata
	var next *DocMetadata
	for i, d := range s.docList {
		if d.Slug == slug {
			if i > 0 {
				prevMeta := s.docList[i-1]
				prev = &prevMeta
			}
			if i < len(s.docList)-1 {
				nextMeta := s.docList[i+1]
				next = &nextMeta
			}
			break
		}
	}

	doc := &Doc{
		Metadata:    meta,
		RawMarkdown: string(rawBytes),
		HTML:        template.HTML(htmlStr),
		Prev:        prev,
		Next:        next,
	}

	s.cache.Store(slug, doc)
	return doc, nil
}

func postProcessHTML(input string) string {
	// Add custom wrapper and styling enhancements to tables
	res := strings.ReplaceAll(input, "<table>", "<div class=\"overflow-x-auto my-6 rounded-xl border border-border-subtle glass-card\"><table class=\"w-full text-left text-sm border-collapse\">")
	res = strings.ReplaceAll(res, "</table>", "</table></div>")
	res = strings.ReplaceAll(res, "<thead>", "<thead class=\"bg-bg-surface/90 text-neon-cyan border-b border-border-subtle uppercase text-xs font-mono\">")
	res = strings.ReplaceAll(res, "<th>", "<th class=\"px-4 py-3 font-semibold\">")
	res = strings.ReplaceAll(res, "<td>", "<td class=\"px-4 py-3 border-b border-border-subtle/40 text-text-secondary\">")
	res = strings.ReplaceAll(res, "<pre>", "<pre class=\"my-5 p-5 rounded-xl glass-card border border-border-subtle font-mono text-xs sm:text-sm text-text-primary overflow-x-auto shadow-lg\">")
	return res
}
