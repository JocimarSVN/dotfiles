"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.findFiles = (dir, mask) => {
    const results = [];
    for (const file of fs.readdirSync(dir)) {
        const stats = fs.lstatSync(path.join(dir, file));
        if (stats.isDirectory()) {
            results.push(...exports.findFiles(path.join(dir, file), mask));
        }
        else {
            if (mask.test(file)) {
                results.push(path.join(dir, file));
            }
        }
    }
    return results;
};
//# sourceMappingURL=utils.js.map