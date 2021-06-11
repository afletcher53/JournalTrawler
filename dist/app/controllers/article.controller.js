"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
const models_1 = __importDefault(require("../models"));
const article_queue_1 = require("../queues/article.queue");
const mongoose_service_1 = require("../requests/mongoose.service");
const article_validation_1 = require("../validation/article.validation");
const json_validation_1 = __importDefault(require("../validation/json.validation"));
const Article = models_1.default.articles;
exports.create = async (req, res) => {
    // Validate request
    const { error } = article_validation_1.articlePostValidation(req.body);
    if (error) {
        const errorArticleValidation = error.details;
        return res.status(400)
            .send(json_validation_1.default.serializeError(errorArticleValidation));
    }
    ;
    // check to see if already exists
    const exists = await mongoose_service_1.mongoCheckArticleExistsByDOI(req.body.doi);
    if (exists) {
        // Generate Error Message if article exists.
        const errorArticleExists = new Error('The Article with the DOI ' + req.body.doi + ' already exists');
        return res.status(400)
            .send(json_validation_1.default.serializeError(errorArticleExists));
    }
    const ArticleData = {
        doi: req.body.doi,
        print_issn: req.body.print_issn,
        electronic_issn: req.body.electronic_issn,
    };
    article_queue_1.addArticle(ArticleData);
    res.status(200).send({ message: 'The worker is working on it' });
};
// Retrieve all Articles from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ?
        { title: { $regex: new RegExp(title), $options: 'i' } } : {};
    Article.find(condition)
        .populate('journal', 'title publisher')
        .then((data) => {
        res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((err) => {
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
        return res.status(400)
            .send(json_validation_1.default.serializeError(error.details[0].message));
    }
    const id = req.params.id;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    Article.findById(id)
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
        logger_1.articleLogger.error('Error getting article', { sessionID: `${req.id}`, requestIP: `${ip}`, articleID: `${id}` });
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
        Article.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Article with id=${id}. Maybe Article was not found!`,
                });
            }
            else
                res.send({ message: process.env.STRING_ARTICLE_UPDATED });
        })
            .catch((err) => {
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
    Article.findByIdAndRemove(id, { useFindAndModify: false })
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
    Article.deleteMany({})
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
    Article.find({ published: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('article', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || process.env.STRING_ERROR_ARTICLES_GET,
        });
    });
};
// Find all published Articles
exports.findByTitleAndDelete = (req, res) => {
    const title = req.params.title;
    Article.find({ title: title })
        .then((data) => {
        res.send(data);
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || process.env.STRING_ERROR_ARTICLES_GET,
        });
    });
};
//# sourceMappingURL=article.controller.js.map