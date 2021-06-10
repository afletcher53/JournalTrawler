"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findJournal = void 0;
const json_validation_1 = __importDefault(require("../../validation/json.validation"));
const models_1 = __importDefault(require("../../models"));
const Journal = models_1.default.journals;
/**
 * function to find a journal based on ISSN string
 * @param {String} issn of the journal to be found
 * @param {axios} res res to be sent
 */
function findJournal(issn, res) {
    Journal.find({ $or: [{ issn_electronic: issn }, { issn_print: issn }] })
        .then((data) => {
        if (data.length == 0) {
            res.status(404).send({ message: 'Not found Journal with issn ' + issn });
        }
        else {
            res.send(json_validation_1.default.serialize('journal', data));
        }
    })
        .catch((err) => {
        res
            .status(500)
            .send({ message: 'Error retrieving Journal with id=' + issn });
    });
}
exports.findJournal = findJournal;
