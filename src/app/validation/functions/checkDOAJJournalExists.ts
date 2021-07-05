import doajLogger from '../../loggers/doaj.logger.';
import { fetchArticleExistsByISSNDOAJ } from '../../requests/doaj.service';

/**
 * Checks if a valid journal exists from DOAJ API
 * @param {string} issn to be searched
 * @returns {Promise<boolean>} true = exists on api, false = doesnt exist
 */
const checkDOAJJournalExistsDOAJ = async (issn: string): Promise<boolean> => {
  try {
    const data = await fetchArticleExistsByISSNDOAJ(issn);
    if (data.results[0] !== undefined && 'bibjson' in data.results[0]) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    doajLogger.error(e);
    return false;
  }
};

export default checkDOAJJournalExistsDOAJ;
