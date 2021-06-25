"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const export_data_1 = __importDefault(require("../utils/export-data"));
const send_email_1 = __importDefault(require("../utils/send-email"));
const wipe_data_1 = __importDefault(require("../utils/wipe-data"));
exports.nuclearWipe = async (req, res) => {
    wipe_data_1.default();
    res.json({ 'message': 'Everything has been wipped' });
};
exports.backup = async (req, res) => {
    export_data_1.default();
    send_email_1.default();
    res.json({ 'message': 'Backups are being prepared' });
};
