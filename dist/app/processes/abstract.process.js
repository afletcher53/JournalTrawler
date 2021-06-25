"use strict";
/** Job which determines which abstract needs to be processed based on the article ISSN */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbstract = void 0;
const mongoose_service_1 = require("../requests/mongoose.service");
const getAbstract = async (job) => {
    // check that the article doesnt have an abstract
    const article = await mongoose_service_1.mongoArticleFindWhere({ doi: job.data.doi });
    if (!article.abstract) { //TODO: Sort out DOAJ Abstract scraping
        //check to see what type of abstract is required to be fetched (DOAJ, Springer etc)
        console.log(article);
    }
};
exports.getAbstract = getAbstract;
