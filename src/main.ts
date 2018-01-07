import * as vscode from "vscode"
import { getParagraphHandler } from "./commands/getParagraphHandler";
import { getTextHandler } from "./commands/getTextHandler";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extensions is now active!")

  const getPararaphCommand = vscode.commands.registerCommand(
    "extension.getParagraph",
    getParagraphHandler
  )

  const getTextCommand = vscode.commands.registerCommand(
    "extension.getText",
    getTextHandler
  )

  context.subscriptions.push(getPararaphCommand)
}

export function deactivate() {
}