const WGSL = require("tree-sitter-wgsl/grammar")

module.exports = grammar(WGSL, {
    name: 'wgsl_bevy',

    rules: {
        _declaration: ($, original) => choice(
            $.preproc_import,
            $.define_import_path,
            $.preproc_ifdef,
            //$.preproc_if,
            original,
        ),

        _statement: ($, original) => choice(
            $.preproc_import,
            alias($.preproc_ifdef_in_statement, $.preproc_ifdef),
            //$.preproc_if,
            original,
        ),

        function_declaration: ($, original) => choice(seq(
            optional("virtual"),
            original
        ), seq(
            "override",
            repeat($.attribute),
            "fn",
            field("name", $.import_path),
            "(",
            field("parameters", optional($.parameter_list)),
            ")",
            field("type", optional($.function_return_type_declaration)),
            field("body", $.compound_statement)
        )),

        struct_declaration: $ => seq(
            "struct",
            field("name", $.identifier),
            "{",
            $._struct_declaration_content,
            "}"
        ),

        _struct_declaration_content: $ => seq(
            repeat(choice(seq($.struct_member, ","), $.preproc_import, alias($.preproc_ifdef_in_struct_declaration, $.preproc_ifdef))),
            choice($.struct_member, $.preproc_import, alias($.preproc_ifdef_in_struct_declaration, $.preproc_ifdef)),
            optional(",")),

        preproc_import: $ => seq(
            preprocessor('import'),
            field('path', choice(
                $.import_path,
            )),
            optional(choice(commaSep1($.identifier), field("alias", $.alias))),
            '\n'
        ),
        define_import_path: $ => seq(
            preprocessor('define_import_path'),
            field('path', choice(
                $.import_path,
            )),
            '\n'
        ),
        import_path: $ => doubleColonSep1($.identifier),
        alias: $ => seq('as', $.identifier),

        ...preprocIf('', $ => $._declaration),
        ...preprocIf('_in_statement', $ => $._statement),
        ...preprocIf('_in_struct_declaration', $ => seq(choice($.struct_member, $.preproc_import, alias($.preproc_ifdef_in_struct_declaration, $.preproc_ifdef)),
            optional(","))),
    }
});

// from tree-sitter-c
function preprocessor(command) {
    return alias(new RegExp('#[ \t]*' + command), '#' + command)
}

// from tree-sitter-c
function preprocIf(suffix, content) {
    function elseBlock($) {
        return choice(
            suffix ? alias($['preproc_else' + suffix], $.preproc_else) : $.preproc_else,
            //suffix ? alias($['preproc_elif' + suffix], $.preproc_elif) : $.preproc_elif,
        );
    }

    return {
        //['preproc_if' + suffix]: $ => seq(
        //preprocessor('if'),
        //field('condition', $._preproc_expression),
        //'\n',
        //repeat(content($)),
        //field('alternative', optional(elseBlock($))),
        //preprocessor('endif')
        //),

        ['preproc_ifdef' + suffix]: $ => seq(
            choice(preprocessor('ifdef'), preprocessor('ifndef')),
            field('name', $.identifier),
            repeat(content($)),
            field('alternative', optional(elseBlock($))),
            preprocessor('endif')
        ),

        ['preproc_else' + suffix]: $ => seq(
            preprocessor('else'),
            repeat(content($))
        ),

        //['preproc_elif' + suffix]: $ => seq(
        //preprocessor('elif'),
        //field('condition', $._preproc_expression),
        //'\n',
        //repeat(content($)),
        //field('alternative', optional(elseBlock($))),
        //)
    }
}

function doubleColonSep1(rule) {
    return seq(rule, repeat(seq('::', rule)))
}

function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)))
}
