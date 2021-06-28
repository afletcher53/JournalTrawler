
import { Job } from 'bull';

import jobLiterals from '../Typescript/Enums/JobCode.enum';
import { incompleteData } from './functions/incompleteData';
import updateISSN from './functions/updateISSN';
import { missingDOIs } from './functions/saveMissingDOIs';

/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 * NB job.data.code refers to the type of integrity check that you need, 1 = Missing DOIs, 2 = Percentage incomplete fields
 */
const integrityProcess = async (job: Job) => {

  switch (job.data.code) {
    case (jobLiterals.MISSING_DOIS):
      await missingDOIs(job);
      break;
    case (jobLiterals.DATA_COMPLETENESS_SINGLE):
      await incompleteData(job);
      break;
    case (jobLiterals.UPDATE_ISSN_SINGLE):
      await updateISSN(job);
      break;
  }
};

export default integrityProcess;


