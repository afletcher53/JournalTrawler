/** Job which determines which abstract needs to be processed based on the article ISSN */
import { Job } from 'bull';

import { mongoArticleFindWhere, mongoFindJournalById } from '../requests/mongoose.service';

export const getAbstract = async (job: Job) => {
const article = await mongoArticleFindWhere({ doi: job.data.doi });
const journal = await mongoFindJournalById(article[0].journal._id);
console.log(journal)

//TODO: collect the abstract source variables and fire off jobs based off that -> switch statement suggested also if abstract is empty 

};
