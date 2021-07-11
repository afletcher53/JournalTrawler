"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const journal_controller_1 = __importDefault(require("../controllers/journal.controller"));
exports.default = (app) => {
    const router = require('express').Router();
    router.post('/', journal_controller_1.default.create);
    router.get('/', journal_controller_1.default.findAll);
    router.get('/published', journal_controller_1.default.findAllPublished);
    router.get('/crscraped', journal_controller_1.default.findAllCRScraped);
    router.get('/crunscraped', journal_controller_1.default.findAllCRUnscraped);
    router.get('/:id', journal_controller_1.default.findOne);
    router.put('/:id', journal_controller_1.default.update);
    router.delete('/:id', journal_controller_1.default.deleteOne);
    router.delete('/', journal_controller_1.default.deleteAll);
    app.use('/api/journals', router);
};
