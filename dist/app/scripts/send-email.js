"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_config_1 = require("../config/email.config");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
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
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
var mailOptions = {
    attachments: [
        {
            filename: `Article_${year}-${month}-${date}.csv`,
            path: `data/backup_Article_${year}-${month}-${date}.csv` // stream this file
        },
        {
            filename: `Journal_${year}-${month}-${date}.csv`,
            path: `data/backup_Journal_${year}-${month}-${date}.csv` // stream this file
        },
        {
            filename: `Integrities_${year}-${month}-${date}.csv`,
            path: `data/backup_Integrities_${year}-${month}-${date}.csv` // stream this file
        },
    ],
    from: email_config_1.emailAccount,
    to: email_config_1.emailAccount,
    subject: 'JournalTrawler Database Backup ready',
    text: 'That was easy!'
};
const sendEmailBackup = () => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
};
exports.default = sendEmailBackup;
