"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const integrity_controller_1 = __importDefault(require("../controllers/integrity.controller"));
exports.default = (app) => {
    const router = require('express').Router();
    // Retrieve all Integrities
    router.get('/', integrity_controller_1.default.findAll);
    // Check issn for DOIs
    router.post('/issn-doi', integrity_controller_1.default.createISSNforDOI);
    // Check issn for missing fields
    router.post('/issn-missing', integrity_controller_1.default.createISSNforMissing);
    // check for all missing fields
    router.get('/issn-missing-all', integrity_controller_1.default.createISSNforAllMissing);
    // Check issn for missing fields
    router.post('/issn-update', integrity_controller_1.default.updateISSN);
    // Update all missing ISSNs
    router.get('/issn-update-all', integrity_controller_1.default.updateAllISSN);
    // Retrieve a single journal with id
    router.get('/:id', integrity_controller_1.default.findOne);
    // Retrieve all integrity checks for specific ISSN
    router.get('/issn/:id', integrity_controller_1.default.findAllViaISSN);
    // Retrieve all integrity checks for specific ISSN
    router.delete('/', integrity_controller_1.default.deleteAll);
    app.use('/api/integrities', router);
};
