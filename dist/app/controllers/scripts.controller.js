"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exportData_script_1 = __importDefault(require("../scripts/exportData.script"));
const sendEmail_script_1 = __importDefault(require("../scripts/sendEmail.script"));
const wipeData_script_1 = __importDefault(require("../scripts/wipeData.script"));
const models_1 = __importDefault(require("../models"));
const nuclearWipe = async (req, res) => {
    wipeData_script_1.default(models_1.default);
    res.json({ 'message': 'Everything has been wipped' });
};
const backup = async (req, res) => {
    exportData_script_1.default();
    sendEmail_script_1.default();
    res.json({ 'message': 'Backups are being prepared' });
};
exports.default = {
    nuclearWipe,
    backup,
};
