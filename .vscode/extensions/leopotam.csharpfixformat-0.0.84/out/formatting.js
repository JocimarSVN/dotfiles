"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const beautify = require('./js-beautify').js_beautify;
const validCodePatterns = [
    /(\/\*\s*?fixformat +ignore:start\s*?\*\/[\s\S]*?\/\*\s*?fixformat +ignore:end\s*?\*\/)/gm,
    /(\/\*(?:.|\n)*?\*\/)/gm,
    /(\/\/.*?$)/gm,
    /('(?:[^'\\]|\\.)*')/gm,
    /(@"(?:[^"]|\\.|"")*")/gm,
    /("(?:[^"\\]|\\.|"")*")/gm
];
const validCodePatternString = validCodePatterns.map(r => r.source).join('|');
let replaceBackSlashes = false;
const replaceCode = (source, condition, cb) => {
    const flags = condition.flags.replace(/[gm]/g, '');
    const regexp = new RegExp(`${validCodePatternString}|(${condition.source})`, `gm${flags}`);
    return source.replace(regexp, (s, ...args) => {
        if (s[0] === '"' || s[0] === '\'' || (s[0] === '/' && (s[1] === '/' || s[1] === '*'))) {
            return s;
        }
        if (s[0] === '@' && s[1] === '"') {
            return replaceBackSlashes ? s
                .replace(/\\\\/gm, '__vscode_double_backslash__')
                .replace(/\\/gm, '__vscode_backslash__') : s;
        }
        return cb(s, ...args.slice(validCodePatterns.length + 1));
    });
};
const GetNamespaceOrder = (ns, orderedNames) => {
    for (let i = 0; i < orderedNames.length; i++) {
        const item = orderedNames[i];
        let nsTest = item.length < ns.length ? ns.substr(0, item.length) : ns;
        if (item === nsTest) {
            return orderedNames.length - i;
        }
    }
    return 0;
};
exports.process = (content, options) => {
    return new Promise((resolve, reject) => {
        try {
            if (options.styleEnabled) {
                let bracesStyle = options.styleBracesOnSameLine ? 'collapse' : 'expand';
                if (options.styleBracesAllowInlines) {
                    bracesStyle += ',preserve-inline';
                }
                const beautifyOptions = {
                    eol: '\n',
                    brace_style: bracesStyle,
                    indent_with_tabs: options.useTabs,
                    indent_size: options.tabSize,
                    preserve_newlines: true,
                    max_preserve_newlines: options.styleNewLineMaxAmount > 0 ? options.styleNewLineMaxAmount : 0,
                    jslint_happy: false,
                    space_after_anon_function: true,
                    space_in_empty_paren: true,
                    keep_array_indentation: false,
                    e4x: false,
                    operator_position: options.styleOperatorsOnSameLine ? 'before-newline' : 'after-newline',
                    switch_case_indent_ignored: options.styleIndentSwitchCaseIgnored
                };
                content = content.replace(/\r\n/g, '\n');
                replaceBackSlashes = true;
                content = replaceCode(content, /#(?:define|undef|if|else|elif|endif|pragma|warning|error)/gm, s => `// __vscode_pp__${s}`);
                replaceBackSlashes = false;
                content = replaceCode(content, /#(region|endregion)/gm, s => `// __vscode_pp_region__${s}`);
                content = replaceCode(content, /\}\s*?\n\s*?\[/gm, s => `}\n\n[`);
                content = replaceCode(content, /(enum[ \t][^\{]*?\{[^\}]*?\})[ \t]*;/gm, (s, s1) => s1);
                content = beautify(content, beautifyOptions);
                content = content
                    .replace(/__vscode_double_backslash__/gm, '\\\\')
                    .replace(/__vscode_backslash__/gm, '\\');
                content = content.replace(/([ \t]*)\/\/ __vscode_pp__/gm, (s, s1) => {
                    return options.styleIndentPreprocessorIgnored ? '' : `${s1}`;
                });
                content = content.replace(/([ \t]*)\/\/ __vscode_pp_region__/gm, (s, s1) => {
                    return options.styleIndentRegionIgnored ? '' : `${s1}`;
                });
                content = replaceCode(content, /([^\w])([\d][\da-fx]*?) (f|d|u|l|m|ul|lu])([^\w])/gmi, (s, s1, s2, s3, s4) => `${s1}${s2}${s3}${s4}`);
                content = replaceCode(content, /\w\s*?\<((?:[^<>\|\&\{\}\=;\(\)]|<([^>\|\&\{\}\=;\(\)]+>))*)>/gm, s => {
                    return s.replace(/\s+/gm, ' ').replace(/\s*?\<\s*/gm, '<').replace(/\s*?\>/gm, '>');
                });
                content = replaceCode(content, /(\< \<)|(\> \>)/gm, s => s.replace(/\s+/gm, ''));
                content = replaceCode(content, /(enum[ \t][^\{]*?\{)((?:.*?\n)*?)(.*?\}$)/gm, (s, s1, s2, s3) => {
                    const indentMatch = /^[ \t]+/gm.exec(s2);
                    if (indentMatch == null || indentMatch.length === 0) {
                        return s;
                    }
                    const itemIndent = indentMatch[0];
                    return `${s1}${s2.replace(/^[ \t]+/gm, itemIndent)}${s3}`;
                });
                content = replaceCode(content, /(=[^\{\};]*?)(\{[^;]*?)(^ *?\};)/gm, (s, s1, s2, s3) => {
                    if (/\s(?!@)(public|private|protected|internal|class|struct|interface)\s/gm.test(s2)) {
                        return s;
                    }
                    const indentMatch = /^[ \t]+/gm.exec(s2);
                    if (indentMatch == null || indentMatch.length === 0) {
                        return s;
                    }
                    const itemIndent = indentMatch[0];
                    return `${s1}${s2.replace(/^[ \t]+/gm, itemIndent)}${s3}`;
                });
                content = replaceCode(content, /(\$ @|[\$|@]) (?=")/gm, (s, s1) => s1.replace(' ', ''));
                content = replaceCode(content, /([\w\)\]\>]): (\w)/gm, (s, s1, s2) => `${s1} : ${s2}`);
                content = replaceCode(content, /\> ([\(\)\[\];,\.])/gm, (s, s1) => {
                    return `>${s1}`;
                });
                content = replaceCode(content, /( \>)\(/gm, (s, s1) => `${s1} (`);
                if (options.styleSpacesBeforeParenthesis) {
                    content = replaceCode(content, /([\w\)\]\>])\(/gm, (s, s1) => `${s1} (`);
                }
                if (options.styleSpacesBeforeBracket) {
                    content = replaceCode(content, /([\w\)\]\>])\[/gm, (s, s1) => `${s1} [`);
                }
                if (options.styleSpacesAfterParenthesis) {
                    content = replaceCode(content, /\)([\w\(\[])/gm, (s, s1) => `) ${s1}`);
                }
                else {
                    content = replaceCode(content, /\) ([\w\(])/gm, (s, s1) => `)${s1}`);
                }
                if (options.styleSpacesAfterBracket) {
                    content = replaceCode(content, /\]([\w])/gm, (s, s1) => `] ${s1}`);
                }
                if (options.styleSpacesInsideEmptyParenthis) {
                    content = replaceCode(content, /\(\)/gm, s => '( )');
                }
                if (options.styleSpacesInsideEmptyBraces) {
                    content = replaceCode(content, /\{\}/gm, s => '{ }');
                }
                if (options.styleSpacesInsideEmptyBrackets) {
                    content = replaceCode(content, /\[\]/gm, s => '[ ]');
                }
                if (options.styleSpacesBeforeIndexerBracket) {
                    content = replaceCode(content, /this\[/gm, s => 'this [');
                }
                const spaceBefore = options.styleSpacesBeforeParenthesis ? ' ' : '';
                content = replaceCode(content, /operator ([^ \(]+) ?\(/gm, (s, s1) => `operator ${s1}${spaceBefore}(`);
                content = replaceCode(content, /operator([\+\-\!\~]+) ?\(/gm, (s, s1) => `operator ${s1}${spaceBefore}(`);
                content = replaceCode(content, /\([\n \t]*?\w+ : [^\?;,:\n]+(,[ \t\n]+\w+ : [^\?;,:\n]+)*/gm, s => s.replace(/ :/g, ':'));
                content = replaceCode(content, / \? ([\.;])/gm, (s, s1) => `?${s1}`);
                if (!options.styleBracesOnSameLine) {
                    content = replaceCode(content, /(^[ \t]*?)do \{/gm, (s, s1) => `${s1}do\n${s1}{`);
                }
                if (options.styleSpacesRemoveAfterCommandBeforeParenthesis) {
                    const removeRegex = new RegExp(`(${options.styleSpacesRemoveAfterCommandBeforeParenthesis.replace(/ /g, '|')}) \\(`, 'gm');
                    content = replaceCode(content, removeRegex, (s, s1) => `${s1}(`);
                }
                content = replaceCode(content, /=>([^ \t\n])/gm, (s, s1) => `=> ${s1}`);
                if (options.styleNewLineElseCatch) {
                    content = replaceCode(content, /(^[ \t]*?)\} (else|catch)/gm, (s, s1, s2) => `${s1}}\n${s1}${s2}`);
                }
                content = replaceCode(content, /([(<]) in /gm, (s, s1) => `${s1}in `);
            }
            if (options.sortUsingsEnabled) {
                const trimSemiColon = /^\s+|;\s*$/;
                content = replaceCode(content, /(\s*using\s+[.\w]+;)+/gm, rawBlock => {
                    const items = rawBlock.split('\n').filter((l) => l && l.trim().length > 0);
                    items.sort((a, b) => {
                        let res = 0;
                        a = a.replace(trimSemiColon, '');
                        b = b.replace(trimSemiColon, '');
                        if (options.sortUsingsOrder) {
                            const ns = options.sortUsingsOrder.split(' ');
                            res -= GetNamespaceOrder(a.substr(6), ns);
                            res += GetNamespaceOrder(b.substr(6), ns);
                            if (res !== 0) {
                                return res;
                            }
                        }
                        for (let i = 0; i < a.length; i++) {
                            const lhs = a[i].toLowerCase();
                            const rhs = b[i] ? b[i].toLowerCase() : b[i];
                            if (lhs !== rhs) {
                                res = lhs < rhs ? -1 : 1;
                                break;
                            }
                            if (lhs !== a[i]) {
                                res++;
                            }
                            if (rhs !== b[i]) {
                                res--;
                            }
                            if (res !== 0) {
                                break;
                            }
                        }
                        return res === 0 && b.length > a.length ? -1 : res;
                    });
                    if (options.sortUsingsSplitGroups) {
                        let i = items.length - 1;
                        const baseNS = /\s*using\s+(\w+).*/;
                        let lastNS = items[i--].replace(baseNS, '$1');
                        let nextNS;
                        for (; i >= 0; i--) {
                            nextNS = items[i].replace(baseNS, '$1');
                            if (nextNS !== lastNS) {
                                lastNS = nextNS;
                                items.splice(i + 1, 0, '');
                            }
                        }
                    }
                    for (let i = 1; i >= 0; i--) {
                        if (rawBlock[i] === '\n') {
                            items.unshift('');
                        }
                    }
                    return items.join('\n');
                });
            }
            if (options.styleNewLineAtEnd) {
                if (content) {
                    content += '\n';
                }
            }
            resolve(content);
        }
        catch (ex) {
            reject(`internal error (please, report to extension owner): ${ex.message}`);
        }
    });
};
//# sourceMappingURL=formatting.js.map