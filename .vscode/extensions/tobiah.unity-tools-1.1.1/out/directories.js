"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let fs = require('fs');
function GenerateOrganizationFolders(path, generationFolders) {
    for (var j = 0; j < generationFolders.length; j++) {
        var dir = path + generationFolders[j];
        fs.mkdir(dir, function (err) {
            // dir has now been created
            // Cannot use the following methods to check if folders already exist: fs.stat, EEXIST and ENOENT;
            // the methods prevent folders from being recreated if they are ever deleted by user. 
        });
    }
}
exports.GenerateOrganizationFolders = GenerateOrganizationFolders;
//# sourceMappingURL=directories.js.map