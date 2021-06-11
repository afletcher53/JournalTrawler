
import { Job } from 'bull';
import db from '../models';
import { fetchDOIsFromISSN } from '../requests/crossref.service';

export const Article = db.articles;
const Integrity = db.integrity;
const Journal = db.journals;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const integrityProcess = async (job:Job) => {
  const journal = await  Journal.findOne({$or: [{issn_electronic: job.data.issn}, {issn_print: job.data.issn}]})
  console.log(typeof journal)
  // //check for integrity
  const crossrefDOISfromISSN = await fetchDOIsFromISSN(encodeURI(job.data.issn))
  let crossrefISSNDOIlist = []
  crossrefDOISfromISSN.forEach((e)=> {
    crossrefISSNDOIlist.push(e['DOI'])
  })
  
  const missingDOIs = await generateMissingDOIList(crossrefISSNDOIlist)
  let obj = {
    data: missingDOIs, 
    issn: job.data.issn
  }
  console.log(journal._id)
  if(missingDOIs.length > 0){
  const integrity = new Integrity({
    code: 1,
    message: "There are " + missingDOIs.length + " DOIS missing for ISSN: " + job.data.issn,
    journal: journal._id,
    data: obj,
  });

  integrity.save(integrity)
  } else {
    const integrity = new Integrity({
      code: 2,
      message: "There are no missing DOIS missing for ISSN: " + job.data.issn,
      data: null,
      journal: journal._id,
    });
  
    integrity.save(integrity)
  }

};

/**
 * Checks a list of DOIs to see if missing from database 
 * @param listtoCheck List that needs to be checked
 * @returns List of strings that dont exist in mongoose DB
 */
const generateMissingDOIList = async (listtoCheck: Array<string>): Promise<string[]> => {
    let doesntExist: Array<string> = []
  
    for (let i = 0; i <= listtoCheck.length-1; i++) {
      const docCount: number = await Article.countDocuments({ doi: listtoCheck[i] }).exec();
      if (docCount != 1) doesntExist.push(listtoCheck[i])
    }
    return doesntExist
  }

export default integrityProcess;