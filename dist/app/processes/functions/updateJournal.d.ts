import { Job } from "bull";
/**
 * Updates a journal based on missing DOIs list generated from Integrity check
 * First check to see if the Journal exists in the database then generate missing list of DOIS, then add them
 */
declare const updateISSN: (job: Job<any>) => Promise<void>;
export default updateISSN;
//# sourceMappingURL=updateJournal.d.ts.map