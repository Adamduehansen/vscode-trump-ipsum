import * as vscode from "vscode"
import * as http from "http"

/**
 * 
 */
export function getParagraphHandler() {
  console.log("Executing the \"GetPlaceholder\" command!")

  vscode.window.showQuickPick(new Promise(resolve => resolve(["1", "2", "3", "4", "5"])), {
    placeHolder: "Choose amount of paragraphs"
  }).then(fetchPlaceholder)
}

const fetchPlaceholder = selectedValue => {
  const requestUrl = `http://trumpipsum.net/?paras=${selectedValue}&type=make-it-great`
  console.log("Ready to fetch paragraphs")
  
  http.get(requestUrl, response => {
    const { statusCode } = response

    // Stop execution if request was not successful
    if (statusCode !== 200) {
      vscode.window.showErrorMessage(`Request failed: ${statusCode}`)
      response.resume()
      return
    }

    let rawData
    response.on("data", chuck => {rawData += chuck})
    response.on("end", () => {
      const regex = /<div class="anyipsum-output"><p>([\s\S]*?)<\/p><\/div>/
      var placeholderText = regex.exec(rawData)[1]
      const activeTextEditor = vscode.window.activeTextEditor
      activeTextEditor.edit(editBuilder => {      
        editBuilder.insert(activeTextEditor.selection.active, placeholderText)
      })
    })
  })
}