module.exports = (app) => {
  const journals = require('../controllers/journal.controller.js');

  const router = require('express').Router();

  // Create a new journal
  router.post('/', journals.create);

  // Retrieve all journals
  router.get('/', journals.findAll);

  // Retrieve all published journals
  router.get('/published', journals.findAllPublished);

  // Retrieve all journals which have been synced with Crossref
  router.get('/crscraped', journals.findAllCRScraped);

  // Retrieve all journals which have been synced with Crossref
  router.get('/crunscraped', journals.findAllCRUnscraped);

  // Retrieve a single journal with id
  router.get('/:id', journals.findOne);

  // Update a journal with id
  router.put('/:id', journals.update);

  // Delete a journal with id
  router.delete('/:id', journals.delete);

  // Create a new journal
  router.delete('/', journals.deleteAll);

  // Add multiple journals at once
  router.post('/multi', journals.bulkAdd);

  app.use('/api/journals', router);
};
