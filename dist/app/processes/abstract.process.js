"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAbstract = void 0;
const doaj_service_1 = require("../requests/doaj.service");
const mongoose_service_1 = require("../requests/mongoose.service");
const springer_service_1 = require("../requests/springer.service");
const getAbstract = async (job) => {
    const article = await mongoose_service_1.mongoArticleFindOneWhere({ doi: job.data.doi });
    const journal = await mongoose_service_1.mongoFindJournalById(article.journal._id);
    if (journal.abstract_source_doaj && !article.abstract) {
        const abstract = await doaj_service_1.fetchAbstractByDOIDOAJ(job.data.doi);
        await mongoose_service_1.mongoUpdateArticleAbstractById(article._id, abstract);
    }
    if (journal.abstract_source_springer && !article.abstract) {
        const abstract = await springer_service_1.fetchAbstractByDOISpringer(job.data.doi);
        await mongoose_service_1.mongoUpdateArticleAbstractById(article._id, abstract);
    }
};
exports.getAbstract = getAbstract;
