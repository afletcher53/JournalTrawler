import db from '../../models';
import { fetchDOIsFromISSN } from '../../requests/crossref.service';
const Article = db.articles;
/**
 * Checks a list of DOIs to see if missing from database
 * @param listtoCheck List that needs to be checked
 * @returns List of strings that dont exist in mongoose DB
 */
const generateMissingDOIList = async (issn: string): Promise<string[]> => {

  const crossrefDOISfromISSN = await fetchDOIsFromISSN(encodeURI(issn));
  const crossrefISSNDOIlist = [];
  crossrefDOISfromISSN.forEach((e) => {
    crossrefISSNDOIlist.push(e['DOI']);
  });

  const doesntExist: Array<string> = [];

  for (let i = 0; i <= crossrefISSNDOIlist.length - 1; i++) {
    const docCount: number = await Article.countDocuments({ doi: crossrefISSNDOIlist[i] }).exec();
    if (docCount !== 1) {
      doesntExist.push(crossrefISSNDOIlist[i]);
    }
  }
  return doesntExist;
};

export default generateMissingDOIList;

