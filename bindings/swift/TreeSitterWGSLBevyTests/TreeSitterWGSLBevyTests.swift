import XCTest
import SwiftTreeSitter
import TreeSitterWGSLBevy

final class TreeSitterWGSLBevyTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_wgsl_bevy())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Bevy grammar")
    }
}
