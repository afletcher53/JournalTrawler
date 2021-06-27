"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
exports.default = (app) => {
    // eslint-disable-next-line new-cap
    const router = require('express').Router();
    // Create a new article
    router.post('/', article_controller_1.default.create);
    // Retrieve all articles
    router.get('/', article_controller_1.default.findAll);
    // Retrieve all published articles
    router.get('/published', article_controller_1.default.findAllPublished);
    // Retrieve a single article with id
    router.get('/:id', article_controller_1.default.findOne);
    // Update a article with id
    router.put('/:id', article_controller_1.default.update);
    // Delete a article with id
    router.delete('/:id', article_controller_1.default.deleteOne);
    // Create a new article
    router.delete('/', article_controller_1.default.deleteAll);
    app.use('/api/articles', router);
};
