import express from 'express';
import journals from '../controllers/journal.controller';

export default (app: express.Application) => {


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
  router.delete('/:id', journals.deleteOne);

  // Create a new journal
  router.delete('/', journals.deleteAll);

  app.use('/api/journals', router);
};
