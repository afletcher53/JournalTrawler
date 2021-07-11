"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignJournal = void 0;
const models_1 = __importDefault(require("../../models"));
const Journal = models_1.default.journals;
function assignJournal(data, crDate, issnPrint, issnElectronic) {
    return new Journal({
        title: data.data.message.title ? data.data.message.title : null,
        publisher: data.data.message.publisher ? data.data.message.publisher : null,
        counts_totaldois: data.data.message.counts['total-dois']
            ? data.data.message.counts['total-dois']
            : null,
        counts_currentdois: data.data.message.counts['current-dois']
            ? data.data.message.counts['current-dois']
            : null,
        counts_backfiledois: data.data.message.counts['backfile-dois']
            ? data.data.message.counts['backfile-dois']
            : null,
        cr_parsed: false,
        cr_last_status_check_time: crDate ? crDate : null,
        issn_print: issnPrint ? issnPrint : null,
        issn_electronic: issnElectronic ? issnElectronic : null
    });
}
exports.assignJournal = assignJournal;
