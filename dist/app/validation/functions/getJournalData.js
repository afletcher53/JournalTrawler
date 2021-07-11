"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crossref_service_1 = require("../../requests/crossref.service");
const assignJournal_1 = require("./assignJournal");
const getJournalDataCrossref = async (issn) => {
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
    return assignJournal_1.assignJournal(data, crDate, issnPrint, issnElectronic);
};
exports.default = getJournalDataCrossref;
