
import { Job } from 'bull';
import db from '../models';
import { generateMissingDOIList } from './functions/generateMissingDOIList';
import { incompleteData } from './functions/incompleteData';
import updateISSN from './functions/updateJournal';

export const Article = db.articles;
const Integrity = db.integrity;
export const Journal = db.journals;
/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 * NB job.data.code refers to the type of integrity check that you need, 1 = Missing DOIs, 2 = Percentage incomplete fields
 */
const integrityProcess = async (job:Job) => {

  switch (job.data.code){
     case(1):
        await missingDOIs(job);
        break;
      case(2): 
        await incompleteData(job);
        break;
      case(3):
        await updateISSN(job);
        break;
      case(4):
        break;  

  }


};

export default integrityProcess;

async function missingDOIs(job: Job<any>) {
  const journal = await Journal.findOne({ $or: [{ issn_electronic: job.data.issn }, { issn_print: job.data.issn }] });
  const missingDOIs = await generateMissingDOIList(job.data.issn);
  let obj = {
    data: missingDOIs,
    issn: job.data.issn
  };
  if (missingDOIs.length > 0) {
    const integrity = new Integrity({
      code: 1,
      message: "There are " + missingDOIs.length + " DOIS missing for ISSN: " + job.data.issn,
      journal: journal._id,
      data: obj,
    });

    integrity.save(integrity);
  } else {
    const integrity = new Integrity({
      code: 2,
      message: "There are no missing DOIS missing for ISSN: " + job.data.issn,
      data: null,
      journal: journal._id,
    });

    integrity.save(integrity);
  }
}
export function convert(obj: { [x: string]: number; _id?: number; crossref_url?: number; journal_issn_electronic?: number; journal_issn_print?: number; publisher?: number; reference_count?: number; is_referenced_by_count?: number; published_online?: number; published_print?: number; type?: number; abstract?: number; title?: number; url?: number; doi?: number; license?: number; cr_parsed?: number; journal?: number; createdAt?: number; updatedAt?: number; }, articleCount: number) {
  return Object.keys(obj).map(key => ({
      name: key,
      value: obj[key],
      percentage: obj[key] / articleCount * 100
  }));
}

