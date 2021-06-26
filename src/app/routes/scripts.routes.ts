import express from 'express';
import scripts from '../controllers/scripts.controller';

export default (app: express.Application) => {


    // eslint-disable-next-line new-cap
    const router = require('express').Router();

    router.get('/nuclearwipe', scripts.nuclearWipe);

    router.get('/backup', scripts.backup);

    app.use('/api/scripts', router);
  };
