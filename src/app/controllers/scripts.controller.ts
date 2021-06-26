import express from 'express';
import exportData from '../scripts/exportData.script';
import sendEmail from '../scripts/sendEmail.script';
import wipeall from '../scripts/wipeData.script';
import db from '../models';

exports.nuclearWipe = async (req: express.Request, res: express.Response) => {
  wipeall(db);
  res.json({'message': 'Everything has been wipped'});
};

exports.backup = async (req: express.Request, res: express.Response) => {
  exportData();
  sendEmail();
  res.json({'message': 'Backups are being prepared'});
};
