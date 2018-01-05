import * as vscode from "vscode"
import { getParagraphHandler } from "./commands/getParagraphHandler";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extensions is now active!")

  const getPararaphCommand = vscode.commands.registerCommand(
    "extension.getParagraph",
    getParagraphHandler
  )

  context.subscriptions.push(getPararaphCommand)
}

export function deactivate() {
}