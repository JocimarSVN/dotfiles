'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Data_1 = require("./Data");
const ReviewPopup_1 = require("./ReviewPopup");
const GoogleAnalytics_1 = require("./GoogleAnalytics");
function activate(context) {
    // 👨‍💼 heavy business.
    Data_1.Data.CreateInstanceWithContext(context);
    GoogleAnalytics_1.GoogleAnalytics.CreateInstanceWithContext(context);
    ReviewPopup_1.ReviewPopup.PopInContextIfNeeded(context);
    // 📊 Google Analytics.
    GoogleAnalytics_1.GoogleAnalytics.AppEvent("Launched");
    vscode.workspace.onDidOpenTextDocument((textDocument) => {
        // Language / file extension statistics (investigating why people use `plaintext` language that much).
        var fileExtension = (textDocument.fileName.includes("."))
            ? textDocument.fileName.split('.').pop()
            : "not set";
        GoogleAnalytics_1.GoogleAnalytics.AppEvent("Did Open Text Document", textDocument.languageId + " (" + fileExtension + ")");
    });
    // 👉 direct invocations (for testing mainly).
    context.subscriptions.push(vscode.commands.registerCommand('eppz.code.popUpReview', () => {
        Data_1.Data.Instance().reviewDidClicked = false; // Reset
        ReviewPopup_1.ReviewPopup.PopInContext(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('eppz.code.resetReviewCounters', () => { Data_1.Data.Reset(); }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=main.js.map