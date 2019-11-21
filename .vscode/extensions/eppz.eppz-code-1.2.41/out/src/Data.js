"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAnalytics_1 = require("./GoogleAnalytics");
class Data {
    static CreateInstanceWithContext(context) {
        Data.instance = new Data(context);
        Data.instance.launchCountSinceInstall++; // Increase launch counter
    }
    static Instance() { return Data.instance; }
    static Reset() {
        Data.instance.reviewDidClicked = false;
        Data.instance.launchCountSinceInstall = 0;
        Data.instance.analyticsHasDisabled = false;
        GoogleAnalytics_1.GoogleAnalytics.ReviewEvent('Reset');
    }
    constructor(context) { this.context = context; }
    // `reviewDidClicked`.
    get reviewDidClicked() { return this.context.globalState.get("reviewDidClicked") == true; }
    set reviewDidClicked(value) { this.context.globalState.update("reviewDidClicked", value); }
    // `launchesSinceLastReviewClose`.
    get launchCountSinceInstall() { return Number(this.context.globalState.get("launchCount")); }
    set launchCountSinceInstall(value) { this.context.globalState.update("launchCount", value); }
    // `analyticsHasDisabled`.
    get analyticsHasDisabled() { return this.context.globalState.get("analyticsHasDisabled") == true; }
    set analyticsHasDisabled(value) { this.context.globalState.update("analyticsHasDisabled", value); }
    // `UUID`.
    get UUID() {
        // Create lazy.
        if (this.context.globalState.get("UUID") == null) {
            this.context.globalState.update("UUID", this.GenerateUUID());
        }
        return this.context.globalState.get("UUID");
    }
    GenerateUUID() {
        // From http://stackoverflow.com/questions/33005400/how-to-generate-a-uuid-in-visual-studio-code
        var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
        // c.f. rfc4122 (UUID version 4 = xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
        var oct = "", tmp;
        for (var a = 0; a < 4; a++) {
            tmp = (4294967296 * Math.random()) | 0;
            oct += hexValues[tmp & 0xF] + hexValues[tmp >> 4 & 0xF] + hexValues[tmp >> 8 & 0xF] + hexValues[tmp >> 12 & 0xF] + hexValues[tmp >> 16 & 0xF] + hexValues[tmp >> 20 & 0xF] + hexValues[tmp >> 24 & 0xF] + hexValues[tmp >> 28 & 0xF];
        }
        // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
        var clockSequenceHi = hexValues[8 + (Math.random() * 4) | 0];
        return oct.substr(0, 8) + "-" + oct.substr(9, 4) + "-4" + oct.substr(13, 3) + "-" + clockSequenceHi + oct.substr(16, 3) + "-" + oct.substr(19, 12);
    }
}
exports.Data = Data;
//# sourceMappingURL=Data.js.map