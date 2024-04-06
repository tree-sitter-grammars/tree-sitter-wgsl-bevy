package tree_sitter_wgsl_bevy_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-wgsl_bevy"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_wgsl_bevy.Language())
	if language == nil {
		t.Errorf("Error loading WgslBevy grammar")
	}
}
