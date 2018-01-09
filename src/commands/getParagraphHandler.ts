import { window, Range } from "vscode"
import * as http from "http"
import { removeTagsAndWhitespace } from "../removeTagsAndWhitespace";

/**
 * Get paragraph handler.
 */
export function getParagraphHandler() {
  console.log("Executing the \"GetPlaceholder\" command!")

  window.showQuickPick(new Promise(resolve => resolve(["1", "2", "3", "4", "5"])), {
    placeHolder: "Choose amount of paragraphs"
  }).then(fetchPlaceholder)
}

/**
 * Fetches an amount of paragraphs through the trump ipsum service.
 * 
 * @param selectedValue   The amount of paragraphs to fetch.
 */
const fetchPlaceholder = selectedValue => {
  console.log("Ready to fetch paragraphs")
  const requestUrl = `http://trumpipsum.net/?paras=${selectedValue}&type=make-it-great`

  const locationOfSelectionBeforeMessage = window.activeTextEditor.selection.active
  window.activeTextEditor.edit(editBuilder => {
    editBuilder.insert(locationOfSelectionBeforeMessage, "Talking to Trump Ipsum...")
  })
  
  http.get(requestUrl, response => {
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
    response.on("data", chuck => {rawData += chuck})
    response.on("end", () => {
      // Write the response content to the active text editor.
      console.log("Finished fetching!")
      const regex = /<div class="anyipsum-output"><p>([\s\S]*?)<\/p><\/div>/
      let placeholderText = regex.exec(rawData)[1]
      placeholderText = removeTagsAndWhitespace(placeholderText)
      
      const locationOfSelectionAfterMessage = window.activeTextEditor.selection.active
      window.activeTextEditor.edit(editBuilder => {      
        editBuilder.insert(window.activeTextEditor.selection.active, placeholderText)
        editBuilder.replace(new Range(locationOfSelectionBeforeMessage, locationOfSelectionAfterMessage), "")
      })
    })
  })
}