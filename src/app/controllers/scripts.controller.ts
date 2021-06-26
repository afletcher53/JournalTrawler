import express from 'express';
import exportData from '../scripts/export-data';
import sendEmail from '../scripts/send-email';
import wipeall from '../scripts/wipe-data';


exports.nuclearWipe = async (req: express.Request, res: express.Response) => {
  wipeall();
  res.json({'message': 'Everything has been wipped'});
};

exports.backup = async (req: express.Request, res: express.Response) => {
  exportData();
  sendEmail();
  res.json({'message': 'Backups are being prepared'});
};
