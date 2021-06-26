import express from 'express';
import integrities from '../controllers/integrity.controller';

export default (app: express.Application) => {


    const router = require('express').Router();

    // Retrieve all Integrities
    router.get('/', integrities.findAll);

    // Check issn for DOIs
    router.post('/issn-doi', integrities.createISSNforDOI);

    // Check issn for missing fields
    router.post('/issn-missing', integrities.createISSNforMissing);

    // check for all missing fields
    router.get('/issn-missing-all', integrities.createISSNforAllMissing);

    // Check issn for missing fields
    router.post('/issn-update', integrities.updateISSN);

    // Update all missing ISSNs
    router.get('/issn-update-all', integrities.updateAllISSN);

    // Retrieve a single journal with id
    router.get('/:id', integrities.findOne);

    // Retrieve all integrity checks for specific ISSN
    router.get('/issn/:id', integrities.findAllViaISSN);

    // Retrieve all integrity checks for specific ISSN
    router.delete('/', integrities.deleteAll);

    app.use('/api/integrities', router);
  };
