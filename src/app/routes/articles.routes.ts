import express from 'express';
import articles from '../controllers/article.controller';
export default (app: express.Application) => {
  // eslint-disable-next-line new-cap
  const router = require('express').Router();

  // Create a new article
  router.post('/', articles.create);

  // Retrieve all articles
  router.get('/', articles.findAll);

  // Retrieve all published articles
  router.get('/published', articles.findAllPublished);

  // Retrieve a single article with id
  router.get('/:id', articles.findOne);

  // Update a article with id
  router.put('/:id', articles.update);

  // Delete a article with id
  router.delete('/:id', articles.deleteOne);

  // Create a new article
  router.delete('/', articles.deleteAll);

  app.use('/api/articles', router);
};
