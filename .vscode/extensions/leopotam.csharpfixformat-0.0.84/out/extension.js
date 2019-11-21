"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vs = require("vscode");
const formatting = require("./formatting");
const fs = require("fs");
const utils = require("./utils");
class FormatProvider {
    provideOnTypeFormattingEdits(document, position, ch, options, token) {
        return this.processFormatting(document, options);
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return this.processFormatting(document, options);
    }
    async processFormatting(document, options) {
        try {
            const result = await formatting.process(document.getText(), getFormatOptions(options));
            const edits = [];
            if (result) {
                const range = new vs.Range(new vs.Position(0, 0), document.lineAt(document.lineCount - 1).range.end);
                edits.push(new vs.TextEdit(range, result));
            }
            return edits;
        }
        catch (ex) {
            vs.window.showWarningMessage(ex);
        }
    }
}
const formatFolder = async (path) => {
    const matches = utils.findFiles(path.fsPath, /\.cs$/mi);
    if (matches.length > 0) {
        const formatOptions = getFormatOptions();
        for (const fn of matches) {
            try {
                let source = fs.readFileSync(fn, 'utf8');
                if (source.charCodeAt(0) === 0xfeff) {
                    source = source.slice(1);
                }
                const result = await formatting.process(source, formatOptions);
                fs.writeFileSync(fn, result, 'utf8');
            }
            catch (ex) {
                throw new Error(`${fn} => ${ex}`);
            }
        }
    }
};
const getFormatOptions = (options) => {
    if (!options) {
        const sysCfg = vs.workspace.getConfiguration('editor');
        options = {
            insertSpaces: sysCfg.get('insertSpaces', true),
            tabSize: sysCfg.get('tabSize', 4),
        };
    }
    const cfg = vs.workspace.getConfiguration('csharpfixformat');
    return {
        useTabs: !options.insertSpaces,
        tabSize: options.tabSize,
        sortUsingsEnabled: cfg.get('sort.usings.enabled', true),
        sortUsingsOrder: cfg.get('sort.usings.order', 'System'),
        sortUsingsSplitGroups: cfg.get('sort.usings.splitGroups', false),
        styleEnabled: cfg.get('style.enabled', true),
        styleNewLineMaxAmount: cfg.get('style.newline.maxAmount', 0),
        styleNewLineAtEnd: cfg.get('style.newline.atEnd', false),
        styleNewLineElseCatch: cfg.get('style.newline.elseCatch', false),
        styleIndentPreprocessorIgnored: cfg.get('style.indent.preprocessorIgnored', true),
        styleIndentRegionIgnored: cfg.get('style.indent.regionIgnored', false),
        styleIndentSwitchCaseIgnored: cfg.get('style.indent.switchCaseIgnored', false),
        styleBracesOnSameLine: cfg.get('style.braces.onSameLine', true),
        styleBracesAllowInlines: cfg.get('style.braces.allowInlines', true),
        styleSpacesBeforeParenthesis: cfg.get('style.spaces.beforeParenthesis', true),
        styleSpacesAfterParenthesis: cfg.get('style.spaces.afterParenthesis', true),
        styleSpacesBeforeIndexerBracket: cfg.get('style.spaces.beforeIndexerBracket', true),
        styleSpacesBeforeBracket: cfg.get('style.spaces.beforeBracket', false),
        styleSpacesAfterBracket: cfg.get('style.spaces.afterBracket', true),
        styleSpacesInsideEmptyParenthis: cfg.get('style.spaces.insideEmptyParenthis', false),
        styleSpacesInsideEmptyBraces: cfg.get('style.spaces.insideEmptyBraces', true),
        styleSpacesInsideEmptyBrackets: cfg.get('style.spaces.insideEmptyBrackets', false),
        styleSpacesRemoveAfterCommandBeforeParenthesis: cfg.get('style.spaces.removeAfterCommandBeforeParenthesis', ''),
        styleOperatorsOnSameLine: cfg.get('style.operators.onSameLine', true)
    };
};
function activate(context) {
    const formatProvider = new FormatProvider();
    context.subscriptions.push(vs.languages.registerDocumentRangeFormattingEditProvider('csharp', formatProvider));
    context.subscriptions.push(vs.languages.registerOnTypeFormattingEditProvider('csharp', formatProvider, '}', ';'));
    context.subscriptions.push(vs.commands.registerCommand('csharpfixformat.formatFolder', async (item) => {
        if (item) {
            const choice = await vs.window.showWarningMessage('[C#FixFormat] Folder formatting operation cant be undone.', 'Continue');
            if (choice) {
                try {
                    formatFolder(item);
                    vs.window.showInformationMessage('[C#FixFormat] Folder formatting completed successfully.');
                }
                catch (ex) {
                    vs.window.showWarningMessage(`[C#FixFormat] Folder formatting error: ${ex}`);
                }
            }
        }
        else {
            vs.window.showInformationMessage('[C#FixFormat] Use folder context menu (explorer window) for command processing.');
        }
    }));
    return { process: formatting.process, getOptions: getFormatOptions };
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map