//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert"

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode"
import { removeTagsAndWhitespace } from "../removeTagsAndWhitespace";

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

  test("cleanParagraph removes p elements", () => {
    const expectedString = "Lorem ipsum"
    let actualString = removeTagsAndWhitespace("<p>Lorem ipsum</p>")
    assert.equal(actualString, expectedString)

    actualString = removeTagsAndWhitespace("Lorem ipsum</p><p>")
    assert.equal(actualString, expectedString)
  })

  test("cleanParagraph removes sequences of whitespace", () => {
    const expectedString = "Lorem Ipsum"
    let actualString = removeTagsAndWhitespace("Lorem       Ipsum")
    assert.equal(actualString, expectedString)
  })
});