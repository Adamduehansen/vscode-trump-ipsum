import { window } from "vscode"
import * as http from "http"

const validateInput = (inputValue: any) => {
  if (isNaN(inputValue)) {
    return "Please enter a numeric value!"
  }

  if (parseInt(inputValue) > 100) {
    return "Please use a number below 100!"
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
}