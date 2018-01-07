import { window } from "vscode"
import * as http from "http"
import { SERVICE_URL } from "../const";

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
 * 
 */
export function getTextHandler() {
  console.log("Executing the \"GetText\" command!")

  window.showInputBox({
    placeHolder: "Enter length of desired text",
    validateInput: validateInput,
  }).then(fetchText)
}

const fetchText = (inputValue: string) => {
  console.log("Ready to fetch text!")
  const requestUrl = `${SERVICE_URL}?paras=3&type=make-it-great`

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
    response.on("data", chuck => {rawData += chuck})
    response.on("end", () => {
      // Write the response content to the active text editor.
      console.log("Finished fetching!")
      const regex = /<div class="anyipsum-output"><p>([\s\S]*?)<\/p><\/div>/
      var placeholderText = regex.exec(rawData)[1]
      var placeholderText = placeholderText.substr(0, parseInt(inputValue))
      const activeTextEditor = window.activeTextEditor
      activeTextEditor.edit(editBuilder => {      
        editBuilder.insert(activeTextEditor.selection.active, placeholderText)
      })
    })
  })
}