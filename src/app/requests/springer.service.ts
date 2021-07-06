import { springerAPIKey } from '../config/springer.config';
import { http } from '../vendors/axios.springer.vendors';

/**
 * Determines is an ISSN exist so on the Springer API
 * @param issn An ISSN (International Standard Serial Number) identifies all continuing resources, irrespective of their medium (print or electronic):
 * @returns {Promise<boolean>} true = exists on the Springer API, false = does not exist on the springer API.
 */
export const checkJournalExistsByISSN = async (
  issn: string
): Promise<boolean> => {
  const issnSearch = 'issn:' + encodeURIComponent(issn);
  const apiKey = '&api_key=' + encodeURIComponent(springerAPIKey);
  const url = 'metadata/json?q=' + issnSearch + apiKey;
  const { data } = await http.get(url);
  if (data.result[0].total > 1) {
    return true;
  } else {
    return false;
  }
};
