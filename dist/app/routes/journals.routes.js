"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const journal_controller_1 = __importDefault(require("../controllers/journal.controller"));
exports.default = (app) => {
    const router = require('express').Router();
    // Create a new journal
    router.post('/', journal_controller_1.default.create);
    // Retrieve all journals
    router.get('/', journal_controller_1.default.findAll);
    // Retrieve all published journals
    router.get('/published', journal_controller_1.default.findAllPublished);
    // Retrieve all journals which have been synced with Crossref
    router.get('/crscraped', journal_controller_1.default.findAllCRScraped);
    // Retrieve all journals which have been synced with Crossref
    router.get('/crunscraped', journal_controller_1.default.findAllCRUnscraped);
    // Retrieve a single journal with id
    router.get('/:id', journal_controller_1.default.findOne);
    // Update a journal with id
    router.put('/:id', journal_controller_1.default.update);
    // Delete a journal with id
    router.delete('/:id', journal_controller_1.default.deleteOne);
    // Create a new journal
    router.delete('/', journal_controller_1.default.deleteAll);
    app.use('/api/journals', router);
};
