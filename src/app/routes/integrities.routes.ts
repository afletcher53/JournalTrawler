module.exports = (app) => {
    const integrities = require('../controllers/integrity.controller');
    
    const router = require('express').Router();
  
    // Retrieve all Integrities
    router.get('/', integrities.findAll);
    
    // Check issn for DOIs
    router.post('/issn-doi', integrities.createISSNforDOI);

    // Retrieve a single journal with id
    router.get('/:id', integrities.findOne);

    // Retrieve all integrity checks for specific ISSN
    router.get('/issn/:id', integrities.findAllViaISSN);

    // Retrieve all integrity checks for specific ISSN
    router.delete('/', integrities.deleteAll);

    app.use('/api/integrities', router);
  };
  