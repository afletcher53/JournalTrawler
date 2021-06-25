"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    const scripts = require('../controllers/scripts.controller');
    // eslint-disable-next-line new-cap
    const router = require('express').Router();
    router.get('/nuclearwipe', scripts.nuclearWipe);
    router.get('/backup', scripts.backup);
    app.use('/api/scripts', router);
};
