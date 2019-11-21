"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var vscode = require("vscode");
var ExceptionItem = /** @class */ (function () {
    function ExceptionItem() {
    }
    return ExceptionItem;
}());
var Exceptions = /** @class */ (function () {
    function Exceptions(exceptions) {
        this.exceptions = exceptions;
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    Exceptions.prototype.always = function (element) {
        this.exceptions[element.name] = "always";
        element.mode = "always";
        this._onDidChangeTreeData.fire();
        this.setExceptionBreakpoints(this.exceptions);
    };
    Exceptions.prototype.never = function (element) {
        this.exceptions[element.name] = "never";
        element.mode = "never";
        this._onDidChangeTreeData.fire();
        this.setExceptionBreakpoints(this.exceptions);
    };
    Exceptions.prototype.unhandled = function (element) {
        this.exceptions[element.name] = "unhandled";
        element.mode = "unhandled";
        this._onDidChangeTreeData.fire();
        this.setExceptionBreakpoints(this.exceptions);
    };
    Exceptions.prototype.addEntry = function (t) {
        var _this = this;
        var options = {
            placeHolder: "(Namespace.ExceptionName)"
        };
        vscode_1.window.showInputBox(options).then(function (value) {
            if (!value) {
                return;
            }
            _this.exceptions[value] = "never";
            _this._onDidChangeTreeData.fire();
        });
    };
    Exceptions.prototype.setExceptionBreakpoints = function (model) {
        var args = {
            filters: [],
            exceptionOptions: this.convertToExceptionOptions(model)
        };
        vscode.debug.activeDebugSession.customRequest('setExceptionBreakpoints', args).then();
    };
    Exceptions.prototype.convertToExceptionOptionsDefault = function () {
        return this.convertToExceptionOptions(this.exceptions);
    };
    Exceptions.prototype.convertToExceptionOptions = function (model) {
        var exceptionItems = [];
        for (var exception in model) {
            exceptionItems.push({
                path: [{ names: [exception] }],
                breakMode: model[exception]
            });
        }
        return exceptionItems;
    };
    Exceptions.prototype.getTreeItem = function (element) {
        return element;
    };
    Exceptions.prototype.getChildren = function (element) {
        var _this = this;
        if (!this.exceptions) {
            vscode_1.window.showInformationMessage('No exception found');
            return Promise.resolve([]);
        }
        return new Promise(function (resolve) {
            if (element) {
                var exceptionItems = [];
                for (var exception in _this.exceptions) {
                    exceptionItems.push(new Exception(exception, _this.exceptions[exception]));
                }
                resolve(exceptionItems);
            }
            else {
                var exceptionItems = [];
                for (var exception in _this.exceptions) {
                    exceptionItems.push(new Exception(exception, _this.exceptions[exception]));
                }
                resolve(exceptionItems);
            }
        });
    };
    Exceptions.prototype.getParent = function (element) {
        return null;
    };
    return Exceptions;
}());
exports.Exceptions = Exceptions;
var Exception = /** @class */ (function (_super) {
    __extends(Exception, _super);
    function Exception(name, mode) {
        var _this = _super.call(this, mode + " : " + name) || this;
        _this.name = name;
        _this.mode = mode;
        _this.contextValue = 'exception';
        return _this;
    }
    Object.defineProperty(Exception.prototype, "label", {
        get: function () {
            return "[" + (this.mode == "always" ? "✔" : "✖") + "] " + this.name;
        },
        set: function (newLabel) {
            this.name = this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exception.prototype, "tooltip", {
        get: function () {
            return "[" + (this.mode == "always" ? "✔" : "✖") + "] " + this.name;
        },
        enumerable: true,
        configurable: true
    });
    return Exception;
}(vscode_1.TreeItem));
//# sourceMappingURL=exceptions.js.map