"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Journal = void 0;
const crossref_service_1 = require("../../requests/crossref.service");
const models_1 = __importDefault(require("../../models"));
exports.Journal = models_1.default.journals;
const getJournalData = async (issn) => {
    const data = await crossref_service_1.fetchJournalByISSN(issn);
    let issnElectronic;
    let issnPrint;
    let crDate;
    const issns = data.data.message['issn-type'];
    if (Object.keys(issns).length > 0) {
        issns.forEach((element) => {
            if (element.type === 'electronic') {
                issnElectronic = element.value;
            }
            if (element.type === 'print') {
                issnPrint = element.value;
            }
        });
    }
    if (issnElectronic === undefined && issnPrint === undefined) {
        issnPrint = decodeURI(issn);
    }
    if (data.data.message['last-status-check-time']) {
        crDate = new Date(data.data.message['last-status-check-time']);
    }
    return assignJournal(data, crDate, issnPrint, issnElectronic);
};
exports.default = getJournalData;
function assignJournal(data, crDate, issnPrint, issnElectronic) {
    return new exports.Journal({
        title: data.data.message.title ? data.data.message.title : null,
        publisher: data.data.message.publisher ? data.data.message.publisher : null,
        counts_totaldois: data.data.message.counts['total-dois'] ? data.data.message.counts['total-dois'] : null,
        counts_currentdois: data.data.message.counts['current-dois'] ? data.data.message.counts['current-dois'] : null,
        counts_backfiledois: data.data.message.counts['backfile-dois'] ? data.data.message.counts['backfile-dois'] : null,
        cr_parsed: false,
        cr_last_status_check_time: crDate ? crDate : null,
        issn_print: issnPrint ? issnPrint : null,
        issn_electronic: issnElectronic ? issnElectronic : null,
    });
}
