
import {Job} from 'bull';
import { DOILogger } from '../../logger';
import db from '../models';
import { fetchDOIsFromISSN } from '../requests/crossref.service';
export const Article = db.articles;
const Integrity = db.integrity;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const integrityProcess = async (job:Job) => {
 
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
  if(missingDOIs.length > 0){
  const integrity = new Integrity({
    code: 1,
    message: "There are " + missingDOIs.length + " DOIS missing for ISSN: " + job.data.issn,
    data: obj,
  });

  integrity.save(integrity)
  } else {
    const integrity = new Integrity({
      code: 2,
      message: "There are no missing DOIS missing for ISSN: " + job.data.issn,
      data: null,
    });
  
    integrity.save(integrity)
  }

};


const generateMissingDOIList = async (listtoCheck: Array<string>): Promise<string[]> => {
    let doesntExist: Array<string> = []
  
    for (let i = 0; i <= listtoCheck.length-1; i++) {
      const docCount: number = await Article.countDocuments({ doi: listtoCheck[i] }).exec();
      if (docCount != 1) doesntExist.push(listtoCheck[i])
    }
    return doesntExist
  }

export default integrityProcess;