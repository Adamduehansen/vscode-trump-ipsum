import { window, Range } from "vscode"
import * as http from "http"
import { SERVICE_URL } from "../const";
import { removeTagsAndWhitespace } from "../removeTagsAndWhitespace";

/**
 * Validates if the passed input value. A valid input must:
 *  1. be a number
 *  2. be below 1000.
 * 
 * @param inputValue   The input value to validate upon.
 */
const validateInput = (inputValue: any) => {
  if (isNaN(inputValue)) {
    return "Please enter a numeric value!"
  }

  if (parseInt(inputValue) > 1000) {
    return "Please use a number below 1000!"
  }

  return ""
}

/**
 * Get text handler
 */
export function getTextHandler() {
  console.log("Executing the \"GetText\" command!")

  window.showInputBox({
    placeHolder: "Enter length of desired text",
    validateInput: validateInput,
  }).then(fetchText)
}

/**
 * Fetches a set of paragraphs and creates a substring with the specified length.
 * 
 * @param textLength 
 */
const fetchText = (textLength: string) => {
  console.log("Ready to fetch text!")
  const requestUrl = `${SERVICE_URL}?paras=3&type=make-it-great`

  const locationOfSelectionBeforeMessage = window.activeTextEditor.selection.active
  window.activeTextEditor.edit(editBuilder => {
    editBuilder.insert(locationOfSelectionBeforeMessage, "Talking to Trump Ipsum...")
  })

  http.get(requestUrl, (response: http.IncomingMessage) => {
    const { statusCode } = response

    // Stop execution if request was not successful
    if (statusCode !== 200) {
      const errorMessage = `Request failed: ${statusCode}`
      console.error(errorMessage)
      window.showErrorMessage(errorMessage)
      response.resume()
      return
    }

    let rawData
    response.on("data", chunk => rawData += chunk)
    response.on("end", () => {
      // Write the response content to the active text editor.
      console.log("Finished fetching!")
      const regex = /<div class="anyipsum-output"><p>([\s\S]*?)<\/p><\/div>/
      let placeholderText = regex.exec(rawData)[1]
      placeholderText = placeholderText.substr(0, parseInt(textLength))
      placeholderText = removeTagsAndWhitespace(placeholderText)
      
      const locationOfSelectionAfterMessage = window.activeTextEditor.selection.active
      window.activeTextEditor.edit(editBuilder => {      
        editBuilder.insert(window.activeTextEditor.selection.active, placeholderText)
        editBuilder.replace(new Range(locationOfSelectionBeforeMessage, locationOfSelectionAfterMessage), "")
      })
    })
  })
}