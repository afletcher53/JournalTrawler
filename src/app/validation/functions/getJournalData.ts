import { fetchJournalByISSN } from '../../requests/crossref.service';
import { assignJournal } from './assignJournal';

/**
 * Gets journal data
 * @param issn issn of the journal
 * @returns Journal object
 */
const getJournalDataCrossref = async (issn: string) => {
  const data = await fetchJournalByISSN(issn);

  let issnElectronic: any;
  let issnPrint: any;
  let crDate: Date;
  const issns = data.data.message['issn-type'];
  if (Object.keys(issns).length > 0) {
    issns.forEach((element: { type: string; value: any }) => {
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

export default getJournalDataCrossref;
