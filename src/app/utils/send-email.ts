import { emailAccount, emailApplicationPassword } from "../config/email.config";

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailAccount,
    pass: emailApplicationPassword
  }
});


let ts = Date.now();   
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

var mailOptions = {
    attachments: [
        {   // file on disk as an attachment
            filename: `Article_${year}-${month}-${date}.csv`,
            path: `data/backup_Article_${year}-${month}-${date}.csv` // stream this file
        },
        {   // file on disk as an attachment
            filename: `Journal_${year}-${month}-${date}.csv`,
            path: `data/backup_Journal_${year}-${month}-${date}.csv` // stream this file
        },
        {   // file on disk as an attachment
            filename: `Integrities_${year}-${month}-${date}.csv`,
            path: `data/backup_Integrities_${year}-${month}-${date}.csv` // stream this file
        },
    ],
  from: emailAccount,
  to: emailAccount,
  subject: 'JournalTrawler Database Backup ready',
  text: 'That was easy!'
};

const sendEmailBackup = () => {
    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
})
}

export default sendEmailBackup

