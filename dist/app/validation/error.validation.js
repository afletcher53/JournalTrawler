"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorGeneric = exports.createErrorExistsCrossRef = exports.createErrorExists = void 0;
const json_validation_1 = __importDefault(require("../validation/json.validation"));
function createErrorExists(value, name) {
    let error = new Error(`A  ${name}  already Exists with value = ${value}`);
    error = json_validation_1.default.serializeError(error);
    return error;
}
exports.createErrorExists = createErrorExists;
function createErrorExistsCrossRef(value, name) {
    let error = new Error(`A  ${name}  doesnt exists on crossref with value = ${value}`);
    error = json_validation_1.default.serializeError(error);
    return error;
}
exports.createErrorExistsCrossRef = createErrorExistsCrossRef;
function createErrorGeneric() {
    let error = new Error('An unknown error occured');
    error = json_validation_1.default.serializeError(error);
    return error;
}
exports.createErrorGeneric = createErrorGeneric;
