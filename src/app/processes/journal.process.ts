import { Job } from 'bull';
import { generateJobsFromISSN } from './functions/generateJobsFromISSN';

/**
 * Starts a Journal Process Job using Bull
 * @param job Incoming Job data
 */
const journalProcess = async (job: Job) => {
  generateJobsFromISSN(job.data.issn, job.data.journal_id);
};

export default journalProcess;
