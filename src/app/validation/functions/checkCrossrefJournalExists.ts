import crossrefLogger from '../../loggers/crossref.logger';
import { fetchJournalHeadByISSN } from '../../requests/crossref.service';

/**
 * Checks if a valid journal exists from crossref API
 * @param {string} issn to be searched
 * @returns {promise<boolean>} true = exists on api, false = doesnt exist
 */

const checkCrossrefJournalExists = async (issn: string): Promise<boolean> => {
  const statusSucess = 200;
  try {
    const res = await fetchJournalHeadByISSN(issn);
    if (typeof res !== 'undefined') {
      if (res.status === statusSucess) {
        crossrefLogger.info('issn exists on crossref' + issn);
        return true;
      }
    } else {
      return false;
    }
  } catch (e) {
    crossrefLogger.error(e);
    return false;
  }
};

export default checkCrossrefJournalExists;
