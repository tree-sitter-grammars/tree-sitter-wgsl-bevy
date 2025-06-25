package tree_sitter_wgsl_bevy_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_wgsl_bevy "github.com/tree-sitter-grammars/tree-sitter-wgsl-bevy/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_wgsl_bevy.Language())
	if language == nil {
		t.Errorf("Error loading Bevy grammar")
	}
}
