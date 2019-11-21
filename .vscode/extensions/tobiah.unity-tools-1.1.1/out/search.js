"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let unity_search = "http://docs.unity3d.com/ScriptReference/30_search.html";
let unity_search_url = unity_search + "?q=";
let msft_search = "https://docs.microsoft.com/";
let msft_search_url = msft_search + "en-us/search/index?search=";
const vscode = require("vscode");
function openURL(search_base, s) {
    return __awaiter(this, void 0, void 0, function* () {
        if (search_base === "open") {
            yield vscode.env.openExternal(vscode.Uri.parse(s));
        }
        else {
            var search_blank_url, search_url;
            if (search_base === "unity") {
                search_blank_url = unity_search;
                search_url = unity_search_url;
            }
            else if (search_base === "msft") {
                search_blank_url = msft_search;
                search_url = msft_search_url;
            }
            if (!s) {
                s = search_blank_url;
            }
            else {
                s = search_url + s;
            }
            yield vscode.env.openExternal(vscode.Uri.parse(s));
        }
        return true;
    });
}
exports.openURL = openURL;
// Slice and Trim
function prepareInput(input, start, end) {
    //input is the whole line, part of which is selected by the user (defined by star/end) 
    if (start >= end) {
        return "";
    }
    //Slice to just the selection
    input = input.slice(start, end);
    //Trim white space
    input = input.trim();
    //Possible future addition:
    //Check right here if valid variable/function name to search?
    //Everything looks good by this point, so time to open a web browser!
    return input;
}
exports.prepareInput = prepareInput;
function openUnityDocs(input, start, end) {
    //Use the node module "opn" to open a web browser
    openURL("unity", prepareInput(input, start, end));
}
exports.openUnityDocs = openUnityDocs;
//# sourceMappingURL=search.js.map