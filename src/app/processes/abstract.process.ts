/** Job which determines which abstract needs to be processed based on the article ISSN */
import { Job } from 'bull';
import articleLogger from '../loggers/article.logger';
import { mongoArticleFindWhere } from '../requests/mongoose.service';

//TODO : Complete this
export const getAbstract = async (job: Job) => {
    // check that the article doesnt have an abstract
    const article = await mongoArticleFindWhere({ doi: job.data.doi });
    if (!article.abstract) {
        //check to see what type of abstract is required to be fetched (DOAJ, Springer etc)
        articleLogger.info(article);
    }

};
