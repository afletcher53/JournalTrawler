/** Job which determines which abstract needs to be processed based on the article ISSN */


import { Job } from "bull";
import { mongoArticleFindWhere } from "../requests/mongoose.service";


export const getAbstract = async(job: Job) => {
    // check that the article doesnt have an abstract
    const article = await mongoArticleFindWhere({doi: job.data.doi})
    if(!article.abstract){ //TODO: Sort out DOAJ Abstract scraping
            //check to see what type of abstract is required to be fetched (DOAJ, Springer etc)
            console.log(article)
    }
    
}