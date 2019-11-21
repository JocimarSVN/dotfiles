"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Data_1 = require("./Data");
const GoogleAnalytics_1 = require("./GoogleAnalytics");
class ReviewPopup {
    static ShouldPop() {
        // Only if not clicked yet.
        if (Data_1.Data.Instance().reviewDidClicked)
            return false;
        // Lookup gentle reminder launch counts.
        var should;
        [2, 35, 100, 2000].forEach((item) => should = should || (Data_1.Data.Instance().launchCountSinceInstall == item));
        return should;
    }
    static PopInContextIfNeeded(context) {
        if (ReviewPopup.ShouldPop() == false)
            return; // Only if should
        ReviewPopup.PopInContext(context);
    }
    static PopInContext(context) {
        // Literals.
        var messages = [
            {
                "text": "Like **eppz!** (C# theme for Unity)? ✨⭐🌟⭐✨ Rate it on the Marketplace!",
                "label": "Like?"
            },
            {
                "text": "Help others discover **eppz!** (C# theme for Unity)! ✨⭐🌟⭐✨ Rate it on the Marketplace!",
                "label": "Help others!"
            },
        ];
        var message = messages[Math.floor(Math.random() * messages.length)]; // Random question from above
        var url = "https://marketplace.visualstudio.com/items?itemName=eppz.eppz-code"; // Skip `#review-details` for now
        var uri = vscode.Uri.parse(url);
        // Show.       
        vscode.window.showInformationMessage(message.text, "Rate🌟").then(selectedOption => {
            if (selectedOption == "Rate🌟") {
                vscode.commands.executeCommand('vscode.open', uri); // Open
                Data_1.Data.Instance().reviewDidClicked = true; // Save
                GoogleAnalytics_1.GoogleAnalytics.ReviewEvent('Review clicked', message.label);
            }
            else {
                GoogleAnalytics_1.GoogleAnalytics.ReviewEvent('Close clicked', message.label);
            }
        });
        GoogleAnalytics_1.GoogleAnalytics.ReviewEvent('Pop up', message.label);
    }
}
exports.ReviewPopup = ReviewPopup;
//# sourceMappingURL=ReviewPopup.js.map