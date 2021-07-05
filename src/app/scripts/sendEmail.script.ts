import { emailAccount, emailApplicationPassword } from '../config/email.config';

import nodemailer from 'nodemailer';
import systemLogger from '../loggers/system.logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  requireTLS: true,
  port: 465,
  secured: true,
  auth: {
    user: emailAccount,
    pass: emailApplicationPassword
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
  from: emailAccount,
  to: emailAccount,
  subject: 'JournalTrawler Database Backup ready',
  text: 'That was easy!'
};

const sendEmailBackup = () => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      systemLogger.error(error);
    } else {
      systemLogger.info('Email sent: ' + info.response);
    }
  });
};

export default sendEmailBackup;
