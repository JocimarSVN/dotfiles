'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const search = require("./search");
const directories = require("./directories");
const fs = require("fs");
function openDocErrorMessage(str) {
    return vscode.window.showErrorMessage("Error: " + str, "Open Docs").then((item) => {
        if (item === "Open Docs") {
            search.openURL("unity");
        }
    });
}
function activate(context) {
    //Tell the user the extension has been activated.
    console.log('Unity Tools extension is now active!');
    // Open Unity Documentation, when you already have something you want to search selected
    var open_docs = vscode.commands.registerTextEditorCommand("unity-tools.OpenDocs", (textEditor, edit) => {
        // selection[0] is the start, and selection[1] is the end
        let selection = textEditor.selection;
        if (!selection.isSingleLine) {
            openDocErrorMessage("Multiple lines selected, please just select a class.");
            return;
        }
        let range = undefined;
        if (!selection.isEmpty) {
            // selection is not empty, get text from it
            range = new vscode.Range(selection.start, selection.end);
        }
        else {
            // selection is empty, get any word at cursor
            range = textEditor.document.getWordRangeAtPosition(selection.active);
        }
        if (range === undefined) {
            openDocErrorMessage("Nothing is selected. Please select a class, or use \"Search Documentation\" instead!");
            return;
        }
        search.openUnityDocs(textEditor.document.lineAt(range.start.line).text, range.start.character, range.end.character);
    });
    context.subscriptions.push(open_docs);
    var searchUnityDocs = vscode.commands.registerCommand("unity-tools.SearchDocs", () => {
        vscode.window.showInputBox({
            prompt: "Search Unity Documentation:"
        }).then((result) => {
            if (result !== undefined) {
                //Use the node module "open" to open a web browser
                search.openURL("unity", result);
            }
        });
    });
    context.subscriptions.push(searchUnityDocs);
    var searchMSDocs = vscode.commands.registerCommand("unity-tools.SearchMSFTDocs", () => {
        vscode.window.showInputBox({
            prompt: "Search MSFT Documentation:"
        }).then((result) => {
            if (result !== undefined) {
                //Use the node module "open" to open a web browser
                search.openURL("msft", result);
            }
        });
    });
    context.subscriptions.push(searchMSDocs);
    var open_vscode_docs = vscode.commands.registerCommand("unity-tools.OpenVSCodeDocs", () => {
        // Using OpenURL from search to open VS Documentation.
        // Passing "true" to open the URL directly (instead of searching Unity docs)
        search.openURL("open", "https://code.visualstudio.com/Docs/runtimes/unity");
    });
    context.subscriptions.push(open_vscode_docs);
    var create_Directories = vscode.commands.registerCommand("unity-tools.CreateDirectories", () => {
        vscode.window.showWorkspaceFolderPick().then((root) => {
            if (root !== undefined) {
                fs.stat(root.uri.fsPath, (err, stats) => {
                    if (err && err.code === 'ENOENT') {
                        vscode.window.showErrorMessage("You do not have access or permission to this file on the hard drive.");
                    }
                    else if (stats.isDirectory()) {
                        var rootPath = root.uri.fsPath + '/Assets/';
                        //path exists
                        fs.stat(rootPath, (err, stats) => {
                            if (err && err.code === 'ENOENT') {
                                // The folder does not exist
                                vscode.window.showErrorMessage("Could not find an Assets Folder in the current workspace of VSCode. Please open the Unity root folder of the project you are working on.");
                            }
                            else if (err) {
                                vscode.window.showErrorMessage("Something went wrong while checking Assets folder existence: " + err);
                            }
                            else if (stats.isDirectory()) {
                                // Folder exists! Generate default folders. 
                                var settings = vscode.workspace.getConfiguration('unity-tools');
                                var folderList = settings.get('defaultOrganizationFolders');
                                if (folderList === undefined) {
                                    vscode.window.showErrorMessage("Could not load defaultOrganizationFolders setting.");
                                }
                                else {
                                    directories.GenerateOrganizationFolders(rootPath, folderList);
                                    vscode.window.showInformationMessage("Folders generated successfully");
                                }
                            }
                        });
                    }
                });
            }
            else {
                vscode.window.showErrorMessage("You do not have a workspace open in VSCode. Please 'Open Folder' to the root folder of a desired Unity Project.");
            }
        });
    });
    context.subscriptions.push(create_Directories);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map