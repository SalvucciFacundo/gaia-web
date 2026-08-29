package gaiaweb

import (
	"embed"
	"io/fs"
)

//go:embed static/*
var staticFS embed.FS

// GetStaticFS returns the static sub-filesystem rooted at static/.
func GetStaticFS() fs.FS {
	sub, err := fs.Sub(staticFS, "static")
	if err != nil {
		panic(err)
	}
	return sub
}
