'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.configureUnityBuildTaskRunner', () => {
        var _state_review = context.globalState.get("review");
        // Pick message.
        var messages = [
            'Like **eppz! (C# theme for Unity)**)? ✨⭐🌟⭐✨ Leave a review on the Marketplace!',
            _state_review
        ];
        var message = messages[1];
        vscode.window.showInformationMessage("" + _state_review, "Review").then(selectedOption => {
            if (selectedOption == "Review") {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=eppz.eppz-code#review-details'));
                context.globalState.update("review", "clicked");
            }
            else {
                // Store that user hit close.
                // Ask again after a month.
                context.globalState.update("review", "closed");
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map