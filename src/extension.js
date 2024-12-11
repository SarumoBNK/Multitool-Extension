"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function message() {
    vscode.window.showInformationMessage('Extension successfully started!');
}
function emoji(countProblems) {
    if (countProblems > 2) {
        return "🤯";
    }
    else {
        return "😊";
    }
}
function countErrors() {
    const diagnostics = vscode.languages.getDiagnostics();
    return diagnostics.length;
}
function activate(context) {
    let disposable = vscode.commands.registerCommand('status-of-problems-extetion.start-show-problems', () => {
        const panel = vscode.window.createWebviewPanel('ShowProb', 'Problems Panel', vscode.ViewColumn.Two, {
            enableScripts: true
        });
        function updateWebview() {
            let countProblems = countErrors();
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
                        <p>Problems: ${1}</p>
                    </div>
                </body>
                </html>
            `;
        }
        message();
        // var test = -1;
        setInterval(() => { updateWebview(); }, 1000);
        updateWebview();
        vscode.workspace.onDidChangeTextDocument(updateWebview);
        vscode.window.onDidChangeActiveTextEditor(updateWebview);
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map