'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var nls = require("vscode-nls");
var child_process_1 = require("child_process");
var exceptions_1 = require("./exceptions");
var localize = nls.config({ locale: process.env.VSCODE_NLS_CONFIG })();
var exceptions;
var DEFAULT_EXCEPTIONS = {
    "System.Exception": "never",
    "System.SystemException": "never",
    "System.ArithmeticException": "never",
    "System.ArrayTypeMismatchException": "never",
    "System.DivideByZeroException": "never",
    "System.IndexOutOfRangeException": "never",
    "System.InvalidCastException": "never",
    "System.NullReferenceException": "never",
    "System.OutOfMemoryException": "never",
    "System.OverflowException": "never",
    "System.StackOverflowException": "never",
    "System.TypeInitializationException": "never"
};
function activate(context) {
    context.subscriptions.push(vscode_1.debug.registerDebugConfigurationProvider("unity", new UnityDebugConfigurationProvider()));
    exceptions = new exceptions_1.Exceptions(DEFAULT_EXCEPTIONS);
    vscode_1.window.registerTreeDataProvider("exceptions", exceptions);
    context.subscriptions.push(vscode_1.commands.registerCommand('exceptions.always', function (exception) { return exceptions.always(exception); }));
    context.subscriptions.push(vscode_1.commands.registerCommand('exceptions.never', function (exception) { return exceptions.never(exception); }));
    context.subscriptions.push(vscode_1.commands.registerCommand('exceptions.addEntry', function (t) { return exceptions.addEntry(t); }));
    context.subscriptions.push(vscode_1.commands.registerCommand('attach.attachToDebugger', function (config) { return startSession(context, config); }));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
var UnityDebugConfigurationProvider = /** @class */ (function () {
    function UnityDebugConfigurationProvider() {
    }
    UnityDebugConfigurationProvider.prototype.provideDebugConfigurations = function (folder, token) {
        var config = [
            {
                name: "Unity Editor",
                type: "unity",
                path: folder.uri.path + "/Library/EditorInstance.json",
                request: "launch"
            },
            {
                name: "Windows Player",
                type: "unity",
                request: "launch"
            },
            {
                name: "OSX Player",
                type: "unity",
                request: "launch"
            },
            {
                name: "Linux Player",
                type: "unity",
                request: "launch"
            },
            {
                name: "iOS Player",
                type: "unity",
                request: "launch"
            },
            {
                name: "Android Player",
                type: "unity",
                request: "launch"
            }
        ];
        return config;
    };
    UnityDebugConfigurationProvider.prototype.resolveDebugConfiguration = function (folder, debugConfiguration, token) {
        if (debugConfiguration && !debugConfiguration.__exceptionOptions) {
            debugConfiguration.__exceptionOptions = exceptions.convertToExceptionOptionsDefault();
        }
        return debugConfiguration;
    };
    return UnityDebugConfigurationProvider;
}());
function startSession(context, config) {
    var execCommand = "";
    if (process.platform !== 'win32')
        execCommand = "mono ";
    child_process_1.exec(execCommand + context.extensionPath + "/bin/UnityDebug.exe list", function (error, stdout, stderr) {
        var processes = [];
        var lines = stdout.split("\n");
        for (var i = 0; i < lines.length; i++) {
            if (lines[i]) {
                processes.push(lines[i]);
            }
        }
        if (processes.length == 0) {
            vscode_1.window.showErrorMessage("No Unity Process Found.");
        }
        else {
            vscode_1.window.showQuickPick(processes).then(function (string) {
                if (!string) {
                    return;
                }
                var config = {
                    "name": string,
                    "request": "launch",
                    "type": "unity",
                    "__exceptionOptions": exceptions.convertToExceptionOptionsDefault()
                };
                vscode_1.debug.startDebugging(undefined, config)
                    .then(function (response) {
                    console.log(response);
                }, function (error) {
                    console.log(error);
                });
            });
        }
    });
}
//# sourceMappingURL=attach.js.map