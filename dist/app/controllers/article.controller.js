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
exports.create = async (req, res) => {
    // Validate request
    const { error } = article_validation_1.articlePostValidation(req.body);
    if (error) {
        const errorArticleValidation = error.details;
        article_logger_1.default.error(errorArticleValidation);
        return res.status(400).send(json_validation_1.default.serializeError(errorArticleValidation));
    }
    ;
    // check to see if already exists
    const exists = await mongoose_service_1.mongoCheckArticleExistsByDOI(req.body.doi);
    if (exists) {
        // Generate Error Message if article exists.
        const errorArticleExists = new Error(`The Article with the DOI ${req.body.doi} already exists`);
        article_logger_1.default.error(errorArticleExists);
        return res.status(400).send(json_validation_1.default.serializeError(errorArticleExists));
    }
    const ArticleData = {
        doi: req.body.doi,
        print_issn: req.body.print_issn,
        electronic_issn: req.body.electronic_issn,
    };
    article_queue_1.addArticle(ArticleData);
    res.status(200).send({ message: 'The worker is working on it' });
    article_logger_1.default.info(`The creation request for ${req.body.doi} is being processed`);
};
// Retrieve all Articles from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ?
        { title: { $regex: new RegExp(title), $options: 'i' } } : {};
    mongoose_service_1.mongoArticleFindWhere(condition)
        .then((data) => {
        res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((err) => {
        article_logger_1.default.error(err);
        res.status(500).send({
            message: json_validation_1.default.serializeError(err.message || process.env.STRING_ERROR_ARTICLES_GET),
        });
    });
};
// Find a single Article with an id
exports.findOne = (req, res) => {
    // Validate request
    const { error } = article_validation_1.articleSingleValidation(req.params);
    if (error) {
        article_logger_1.default.error(error.details[0].message);
        return res.status(400).send(json_validation_1.default.serializeError(error.details[0].message));
    }
    const id = req.params.id;
    mongoose_service_1.mongoArticleFindById(id)
        .then((data) => {
        if (!data) {
            res.status(404).send({ message: 'Not found Article with id ' + id });
        }
        else
            res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((e) => {
        res
            .status(500)
            .send({ message: 'Error retrieving Article with id=' + id });
        article_logger_1.default.error(`Error getting article`);
    });
};
// Update a Article by the id in the request
exports.update = (req, res) => {
    const { error } = article_validation_1.articlePostValidation(req.body);
    if (error) {
        return res.status(400)
            .send(json_validation_1.default.serializeError(error.details[0].message));
    }
    try {
        const id = req.params.id;
        mongoose_service_1.mongoArticleFindByIdandUpdate(id, req)
            .then((data) => {
            if (!data) {
                let message = `Cannot update Article with id=${id}. Maybe Article was not found!`;
                article_logger_1.default.error(message);
                res.status(404).send({
                    message: message,
                });
            }
            else
                res.send({ message: process.env.STRING_ARTICLE_UPDATED });
        })
            .catch((err) => {
            article_logger_1.default.error(err);
            res.status(500).send({
                message: 'Error updating Article with id=' + id,
            });
        });
    }
    catch (e) {
        res.status(400).send(e);
    }
};
// Delete a Article with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    mongoose_service_1.mongoArticleDeleteById(id)
        .then((data) => {
        if (!data) {
            res.status(404).send({
                message: `Cannot delete Article with id=${id}. Maybe Article was not found!`,
            });
        }
        else {
            res.send({
                message: process.env.STRING_ARTICLE_DELETED,
            });
        }
    })
        .catch((err) => {
        res.status(500).send({
            message: 'Could not delete Article with id=' + id,
        });
    });
};
// Delete all Articles from the database.
exports.deleteAll = (req, res) => {
    mongoose_service_1.mongoArticleDeleteAll()
        .then((data) => {
        res.send({
            message: data.deletedCount + ' ' + process.env.STRING_ARTICLES_DELETED,
        });
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || process.env.STRING_ERROR_ARTICLES_GET,
        });
    });
};
// Find all published Articles
exports.findAllPublished = (req, res) => {
    mongoose_service_1.mongoArticleFindWhere({ cr_parsed: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || process.env.STRING_ERROR_ARTICLES_GET,
        });
    });
};
