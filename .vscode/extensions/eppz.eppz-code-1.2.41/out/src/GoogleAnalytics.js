"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const electron_google_analytics_1 = require("electron-google-analytics");
const Data_1 = require("./Data");
class GoogleAnalytics {
    static CreateInstanceWithContext(context) { GoogleAnalytics.instance = new GoogleAnalytics(context); }
    static Instance() { return GoogleAnalytics.instance; }
    // Settings.
    static Disabled() { return (vscode.workspace.getConfiguration('eppz-code')['disableAnalytics'] == true); }
    // Custom Dimension `UUID` (Index: 1, Scope: User).
    static CustomDimension_1() { return Data_1.Data.Instance().UUID; }
    // Custom Dimension `Color Theme` (Index: 2, Scope: Hit).
    static CustomDimension_2() { return vscode.workspace.getConfiguration('workbench')['colorTheme']; }
    constructor(context) {
        this.context = context;
        this.tracker = new electron_google_analytics_1.default('UA-37060479-24');
    }
    static IsEnabled() {
        // If not disabled, return true (reset event).
        if (GoogleAnalytics.Disabled() == false) {
            Data_1.Data.Instance().analyticsHasDisabled = false; // Reset
            return true;
        }
        // If disabled, and event sent, return false (do nothing).
        if (Data_1.Data.Instance().analyticsHasDisabled == true)
            return false;
        // If disabled, return false (do send event).
        GoogleAnalytics._Event("App", "Disable analytics");
        Data_1.Data.Instance().analyticsHasDisabled = true;
        return false;
    }
    static AppEvent(action, label = null) {
        if (GoogleAnalytics.IsEnabled()) {
            GoogleAnalytics._Event("App", action, label);
        }
    }
    static ReviewEvent(action, label = null) {
        if (GoogleAnalytics.IsEnabled()) {
            GoogleAnalytics._Event("Review", action, label);
        }
    }
    static _Event(category, action, label = null) {
        let params = {
            ec: category,
            ea: action,
            el: label,
            cd1: GoogleAnalytics.CustomDimension_1(),
            cd2: GoogleAnalytics.CustomDimension_2()
        };
        GoogleAnalytics.instance.tracker.send('event', params, Data_1.Data.Instance().UUID)
            .then((response) => { return response; })
            .catch((error) => { return error; });
    }
}
exports.GoogleAnalytics = GoogleAnalytics;
//# sourceMappingURL=GoogleAnalytics.js.map