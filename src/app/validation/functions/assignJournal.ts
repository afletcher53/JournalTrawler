import db from '../../models';
const Journal = db.journals;


/**
 * Setter for data to the Journal Object
 * @param data data to be assigned. 
 * @param crDate Date of the last crossref check time
 * @param issnPrint issn of Print
 * @param issnElectronic issn of Electronic
 * @returns Journal object
 */

export function assignJournal(data: any, crDate: Date, issnPrint: any, issnElectronic: any) {
  return new Journal({
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
