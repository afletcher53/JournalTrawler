"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
exports.default = (app) => {
    const router = require('express').Router();
    router.post('/', article_controller_1.default.create);
    router.get('/', article_controller_1.default.findAll);
    router.get('/published', article_controller_1.default.findAllPublished);
    router.get('/:id', article_controller_1.default.findOne);
    router.put('/:id', article_controller_1.default.update);
    router.delete('/:id', article_controller_1.default.deleteOne);
    router.delete('/', article_controller_1.default.deleteAll);
    app.use('/api/articles', router);
};
