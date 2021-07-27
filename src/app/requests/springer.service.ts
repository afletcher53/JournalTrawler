import { springerAPIKey } from '../config/springer.config';
import http from '../vendors/springer.api';

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

/**
 * Grabs Abstract from the Springer API
 * @param doi Digital Object Identifier System number
 * @returns {Promise<any>} Promise object containing the abstract
 */

export const fetchAbstractByDOISpringer = async (doi: string): Promise<any> => {
  const doiSearch = '(doi:' + encodeURIComponent(doi) + ')';
  const apiKey = '&api_key=' + encodeURIComponent(springerAPIKey);
  const url = 'meta/v2/json?q=' + doiSearch + apiKey;
  const { data } = await http.get(url);
  if (data.records[0]) {
    return data.records[0].abstract;
  } else {
    return null;
  }
};
