"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_config_1 = require("../config/email.config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const system_logger_1 = __importDefault(require("../loggers/system.logger"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    secure: true,
    requireTLS: true,
    port: 465,
    secured: true,
    auth: {
        user: email_config_1.emailAccount,
        pass: email_config_1.emailApplicationPassword
    }
});
const ts = Date.now();
const dateObj = new Date(ts);
const date = dateObj.getDate();
const month = dateObj.getMonth() + 1;
const year = dateObj.getFullYear();
const mailOptions = {
    attachments: [
        {
            filename: `Article_${year}-${month}-${date}.csv`,
            path: `data/backup_Article_${year}-${month}-${date}.csv`
        },
        {
            filename: `Journal_${year}-${month}-${date}.csv`,
            path: `data/backup_Journal_${year}-${month}-${date}.csv`
        },
        {
            filename: `Integrities_${year}-${month}-${date}.csv`,
            path: `data/backup_Integrities_${year}-${month}-${date}.csv`
        }
    ],
    from: email_config_1.emailAccount,
    to: email_config_1.emailAccount,
    subject: 'JournalTrawler Database Backup ready',
    text: 'That was easy!'
};
const sendEmailBackup = () => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            system_logger_1.default.error(error);
        }
        else {
            system_logger_1.default.info('Email sent: ' + info.response);
        }
    });
};
exports.default = sendEmailBackup;
