"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var conf_1 = require("../../conf");
var utils_1 = require("../../utils");
function generateHttpReducers(config, name, actionClassNameBase, formSubDirName, responseType) {
    var content = '';
    content += getReducerImports(responseType.startsWith('__model.'));
    content += getStateInteface(actionClassNameBase, responseType);
    content += getInitialState(actionClassNameBase);
    content += getFeatureSelector(name, actionClassNameBase);
    content += getReducerDefinition(actionClassNameBase);
    var reducersFileName = path.join(formSubDirName, conf_1.stateDir, "reducers.ts");
    utils_1.writeFile(reducersFileName, content, config.header);
}
exports.generateHttpReducers = generateHttpReducers;
function getReducerImports(usesModels) {
    var res = "import {createFeatureSelector} from '@ngrx/store';\n\n";
    res += "import {HttpErrorResponse} from '@angular/common/http';\n";
    if (usesModels)
        res += "import * as __model from '../../../../model';\n";
    res += "import * as actions from './actions';\n\n";
    return res;
}
function getStateInteface(actionClassNameBase, type) {
    var res = "export interface " + actionClassNameBase + "State {\n";
    res += utils_1.indent("data: " + type + " | null;\n");
    res += utils_1.indent("loading: boolean;\n");
    res += utils_1.indent("error: HttpErrorResponse | null;\n");
    res += "}\n\n";
    return res;
}
function getInitialState(actionClassNameBase) {
    var res = "export const initial" + actionClassNameBase + "State: " + actionClassNameBase + "State = {\n";
    res += utils_1.indent("data: null,\n");
    res += utils_1.indent("loading: false,\n");
    res += utils_1.indent("error: null,\n");
    res += "};\n\n";
    return res;
}
function getFeatureSelector(name, actionClassNameBase) {
    var res = "export const selectorName = '" + name + "_" + actionClassNameBase + "';\n";
    res += "export const get" + actionClassNameBase + "StateSelector = " +
        ("createFeatureSelector<" + actionClassNameBase + "State>(selectorName);\n\n");
    return res;
}
function getReducerDefinition(actionClassNameBase) {
    var res = "export function " + actionClassNameBase + "Reducer(\n";
    res += utils_1.indent("state: " + actionClassNameBase + "State = initial" + actionClassNameBase + "State,\n");
    res += utils_1.indent("action: actions." + actionClassNameBase + "Action): " + actionClassNameBase + "State {\n\n");
    res += utils_1.indent("switch (action.type) {\n");
    res += utils_1.indent([
        'case actions.Actions.START: return {...state, loading: true, error: null};',
        'case actions.Actions.SUCCESS: return {...state, data: action.payload, loading: false};',
        'case actions.Actions.ERROR: return {...state, error: action.payload, loading: false};',
        'default: return state;',
    ], 2);
    res += utils_1.indent("\n}\n");
    res += "}\n";
    return res;
}
//# sourceMappingURL=generate-http-reducers.js.map