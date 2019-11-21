"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ElectronGoogleAnalytics = require("electron-google-analytics");
class GoogleAnalytics {
    static CreateInstanceWithContext(context) { GoogleAnalytics.instance = new GoogleAnalytics(context); }
    static Instance() { return GoogleAnalytics.instance; }
    // Settings.
    static Disabled() { return (vscode.workspace.getConfiguration('eppz-code')['disableAnalytics'] == true); }
    constructor(context) {
        this.context = context;
        if (GoogleAnalytics.Disabled())
            return;
        this.tracker = new ElectronGoogleAnalytics('UA-37060479-24');
    }
    static AppEvent(action, label = null) {
        if (GoogleAnalytics.Disabled())
            return;
        GoogleAnalytics.instance.tracker.event('App', action, { evLabel: label })
            .then((response) => { return response; })
            .catch((error) => { return error; });
    }
    static ReviewEvent(action, label = null) {
        if (GoogleAnalytics.Disabled())
            return;
        GoogleAnalytics.instance.tracker.event('Review', action, { evLabel: label })
            .then((response) => { return response; })
            .catch((error) => { return error; });
    }
}
exports.GoogleAnalytics = GoogleAnalytics;
//# sourceMappingURL=Analytics.js.map