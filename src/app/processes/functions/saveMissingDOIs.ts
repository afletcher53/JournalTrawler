import { Job } from 'bull';
import generateMissingDOIList from './generateMissingDOIList';
import db from '../../models';
const Integrity = db.integrity;
const Journal = db.journals;

/**
 * Calculates missing DOIS for an ISSN and saves it as an Integrity
 * @param job Job containing Job.data.issn
 */
export async function missingDOIs(job: Job) {
  const journal = await Journal.findOne({
    $or: [{ issn_electronic: job.data.issn }, { issn_print: job.data.issn }]
  });
  const missingDOIs = await generateMissingDOIList(job.data.issn);
  const obj = {
    data: missingDOIs,
    issn: job.data.issn
  };
  if (missingDOIs.length > 0) {
    const integrity = new Integrity({
      code: 1,
      message: `There are ${missingDOIs.length} DOIS missing for ISSN: ${job.data.issn}`,
      journal: journal._id,
      data: obj
    });

    integrity.save(integrity);
  } else {
    const integrity = new Integrity({
      code: 2,
      message: `There are no missing DOIS missing for ISSN: ${job.data.issn}`,
      data: null,
      journal: journal._id
    });

    integrity.save(integrity);
  }
}
