"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
function activate(context) {
  const disposable = vscode.commands.registerCommand("status-of-problems-extetion.start-show-problems", () => {
    const panel = vscode.window.createWebviewPanel(
      "ShowProb",
      "Problems Panel",
      vscode.ViewColumn.Two,
      {
        enableScripts: true
      }
    );
    const countProblems = vscode.languages.getDiagnostics().length;
    panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
			<style>
			.container {
				display: grid;
				margin: 0 auto;
				text-align: center;
				place-items: center;
			}
			.emoji {
				font-size: 100px;
			}
    		</style>
            <head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Problems</title>
			</head>
			<body>
				<div class="container">
					<h1>Problems</h1>
					<p>Here you can see, how bad it is depending on the problems in the current workspace)</p>
					<div class="emoji"> ${emoji(countProblems)} </div>
					<p>Problems: ${countProblems}</p>
				</div>
            </body>
            </html>
        `;
  });
  context.subscriptions.push(disposable);
  message();
}
function message() {
  vscode.window.showInformationMessage("Extension successfully started!");
}
function emoji(countProblems) {
  if (countProblems > 2) {
    return "\u{1F92F}";
  } else {
    return "\u{1F60A}";
  }
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
