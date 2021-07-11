"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const integrity_controller_1 = __importDefault(require("../controllers/integrity.controller"));
exports.default = (app) => {
    const router = require('express').Router();
    router.get('/', integrity_controller_1.default.findAll);
    router.post('/issn-doi', integrity_controller_1.default.createISSNforDOI);
    router.post('/issn-missing', integrity_controller_1.default.createISSNforMissing);
    router.get('/issn-missing-all', integrity_controller_1.default.createISSNforAllMissing);
    router.post('/issn-update', integrity_controller_1.default.updateISSN);
    router.get('/issn-update-all', integrity_controller_1.default.updateAllISSN);
    router.get('/:id', integrity_controller_1.default.findOne);
    router.get('/issn/:id', integrity_controller_1.default.findAllViaISSN);
    router.delete('/', integrity_controller_1.default.deleteAll);
    app.use('/api/integrities', router);
};
