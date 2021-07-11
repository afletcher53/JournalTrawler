"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const article_logger_1 = __importDefault(require("../loggers/article.logger"));
const article_queue_1 = require("../queues/article.queue");
const mongoose_service_1 = require("../requests/mongoose.service");
const article_validation_1 = require("../validation/article.validation");
const json_validation_1 = __importDefault(require("../validation/json.validation"));
const HttpStatusCode_enum_1 = __importDefault(require("../Typescript/Enums/HttpStatusCode.enum"));
const ArticleOperations_enum_1 = __importDefault(require("../Typescript/Enums/ArticleOperations.enum"));
const create = async (req, res) => {
    const { error } = article_validation_1.articlePostValidation(req.body);
    if (error) {
        const errorArticleValidation = error.details;
        article_logger_1.default.error(errorArticleValidation);
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(errorArticleValidation));
    }
    const exists = await mongoose_service_1.mongoCheckArticleExistsByDOI(req.body.doi);
    if (exists) {
        const errorArticleExists = new Error(`The Article with the DOI ${req.body.doi} already exists`);
        article_logger_1.default.error(errorArticleExists);
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(errorArticleExists));
    }
    const ArticleData = {
        doi: req.body.doi,
        print_issn: req.body.print_issn,
        electronic_issn: req.body.electronic_issn
    };
    article_queue_1.addArticle(ArticleData);
    res
        .status(HttpStatusCode_enum_1.default.OK)
        .send({ message: 'The worker is working on it' });
    article_logger_1.default.info(`The creation request for ${req.body.doi} is being processed`);
};
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
const findAll = (req, res) => {
    const title = req.query.title;
    const escapedTitle = escapeRegex(title);
    const condition = title
        ? {
            title: { $regex: new RegExp(escapedTitle), $options: 'i' }
        }
        : {};
    mongoose_service_1.mongoArticleFindWhere(condition)
        .then((data) => {
        res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((err) => {
        article_logger_1.default.error(err);
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: json_validation_1.default.serializeError(err.message || ArticleOperations_enum_1.default.ERROR_ARTICLES_GET)
        });
    });
};
const findOne = (req, res) => {
    const { error } = article_validation_1.articleSingleValidation(req.params);
    if (error) {
        article_logger_1.default.error(error.details[0].message);
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(error.details[0].message));
    }
    const id = req.params.id;
    mongoose_service_1.mongoArticleFindById(id)
        .then((data) => {
        if (!data) {
            res
                .status(HttpStatusCode_enum_1.default.NOT_FOUND)
                .send({ message: 'Not found Article with id ' + id });
        }
        else {
            res.send(json_validation_1.default.serialize('article', data));
        }
    })
        .catch((e) => {
        res
            .status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR)
            .send({ message: 'Error retrieving Article with id=' + id });
        article_logger_1.default.error(`Error getting article`);
    });
};
const update = (req, res) => {
    const { error } = article_validation_1.articlePostValidation(req.body);
    if (error) {
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(error.details[0].message));
    }
    try {
        const id = req.params.id;
        mongoose_service_1.mongoArticleFindByIdandUpdate(id, req)
            .then((data) => {
            if (!data) {
                const returnMessage = `Cannot update Article with id=${id}. Maybe Article was not found!`;
                article_logger_1.default.error(returnMessage);
                res.status(HttpStatusCode_enum_1.default.NOT_FOUND).send({
                    message: returnMessage
                });
            }
            else {
                res.send({ message: ArticleOperations_enum_1.default.ARTICLE_UPDATED });
            }
        })
            .catch((err) => {
            article_logger_1.default.error(err);
            res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
                message: 'Error updating Article with id=' + id
            });
        });
    }
    catch (e) {
        res.status(HttpStatusCode_enum_1.default.CONFLICT).send(e);
    }
};
const deleteOne = (req, res) => {
    const id = req.params.id;
    mongoose_service_1.mongoArticleDeleteById(id)
        .then((data) => {
        if (!data) {
            res.status(HttpStatusCode_enum_1.default.NOT_FOUND).send({
                message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
            });
        }
        else {
            res.send({
                message: ArticleOperations_enum_1.default.ARTICLE_DELETED
            });
        }
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: 'Could not delete Article with id=' + id
        });
    });
};
const deleteAll = (req, res) => {
    mongoose_service_1.mongoArticleDeleteAll()
        .then((data) => {
        res.send({
            message: `${data.deletedCount} ${ArticleOperations_enum_1.default.ARTICLES_DELETED}`
        });
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || ArticleOperations_enum_1.default.ERROR_ARTICLES_GET
        });
    });
};
const findAllPublished = (req, res) => {
    mongoose_service_1.mongoArticleFindWhere({ cr_parsed: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || ArticleOperations_enum_1.default.ERROR_ARTICLES_GET
        });
    });
};
exports.default = {
    create,
    update,
    findAll,
    findOne,
    deleteOne,
    deleteAll,
    findAllPublished
};
