"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scripts_controller_1 = __importDefault(require("../controllers/scripts.controller"));
exports.default = (app) => {
    const router = require('express').Router();
    router.get('/nuclearwipe', scripts_controller_1.default.nuclearWipe);
    router.get('/backup', scripts_controller_1.default.backup);
    app.use('/api/scripts', router);
};
