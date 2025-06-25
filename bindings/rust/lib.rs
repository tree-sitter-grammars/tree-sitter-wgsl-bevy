//! This crate provides Bevy language support for the [tree-sitter] parsing library.
//!
//! Typically, you will use the [`LANGUAGE`] constant to add this language to a
//! tree-sitter [`Parser`], and then use the parser to parse some code:
//!
//! ```
//! let code = r#"
//! #import bevy_pbr::forward_io::VertexOutput
//!
//! struct CustomMaterial {
//!     color: vec4<f32>,
//! };
//!
//! @group(2) @binding(0) var<uniform> material: CustomMaterial;
//!
//! @fragment
//! fn fragment(
//!     mesh: VertexOutput,
//! ) -> @location(0) vec4<f32> {
//! #ifdef IS_RED
//!     return vec4<f32>(1.0, 0.0, 0.0, 1.0);
//! #else
//!     return material.color;
//! #endif
//! }
//! "#;
//! let mut parser = tree_sitter::Parser::new();
//! let language = tree_sitter_wgsl_bevy::LANGUAGE;
//! parser
//!     .set_language(&language.into())
//!     .expect("Error loading Bevy parser");
//! let tree = parser.parse(code, None).unwrap();
//! assert!(!tree.root_node().has_error());
//! ```
//!
//! [`Parser`]: https://docs.rs/tree-sitter/0.25.6/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_wgsl_bevy() -> *const ();
}

/// The tree-sitter [`LanguageFn`] for this grammar.
pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_wgsl_bevy) };

/// The content of the [`node-types.json`] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types
pub const NODE_TYPES: &str = include_str!("../../src/node-types.json");

#[cfg(test)]
mod tests {
    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading Bevy parser");
    }
}
