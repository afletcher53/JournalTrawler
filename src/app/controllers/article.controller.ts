import express from 'express';
import articleLogger from '../loggers/article.logger';
import { addArticle } from '../queues/article.queue';
import {
  mongoArticleDeleteAll,
  mongoArticleDeleteById,
  mongoArticleFindById,
  mongoArticleFindByIdandUpdate,
  mongoArticleFindWhere,
  mongoCheckArticleExistsByDOI
} from '../requests/mongoose.service';
import {
  articlePostValidation,
  articleSingleValidation
} from '../validation/article.validation';
import serializer from '../validation/json.validation';
import HttpStatusCode from '../Typescript/Enums/HttpStatusCode.enum';
import ArticleOperations from '../Typescript/Enums/ArticleOperations.enum';

const create = async (req: express.Request, res: express.Response) => {
  // Validate request
  const { error } = articlePostValidation(req.body);
  if (error) {
    const errorArticleValidation = error.details;
    articleLogger.error(errorArticleValidation);
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(errorArticleValidation));
  }

  // check to see if already exists
  const exists = await mongoCheckArticleExistsByDOI(req.body.doi);
  if (exists) {
    // Generate Error Message if article exists.
    const errorArticleExists = new Error(
      `The Article with the DOI ${req.body.doi} already exists`
    );
    articleLogger.error(errorArticleExists);
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(errorArticleExists));
  }
  const ArticleData = {
    doi: req.body.doi,
    print_issn: req.body.print_issn,
    electronic_issn: req.body.electronic_issn
  };
  addArticle(ArticleData);
  res
    .status(HttpStatusCode.OK)
    .send({ message: 'The worker is working on it' });
  articleLogger.info(
    `The creation request for ${req.body.doi} is being processed`
  );
};

// Retrieve all Articles from the database.
const findAll = (req, res: express.Response) => {
  const title = req.query.title;

  const condition = title
    ? {
        title: { $regex: new RegExp(title), $options: 'i' }
      }
    : {};

  mongoArticleFindWhere(condition)
    .then((data) => {
      res.send(serializer.serialize('article', data));
    })
    .catch((err) => {
      articleLogger.error(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: serializer.serializeError(
          err.message || ArticleOperations.ERROR_ARTICLES_GET
        )
      });
    });
};

// Find a single Article with an id
const findOne = (req, res: express.Response) => {
  // Validate request
  const { error } = articleSingleValidation(req.params);
  if (error) {
    articleLogger.error(error.details[0].message);
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(error.details[0].message));
  }

  const id = req.params.id;
  mongoArticleFindById(id)
    .then((data) => {
      if (!data) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .send({ message: 'Not found Article with id ' + id });
      } else {
        res.send(serializer.serialize('article', data));
      }
    })
    .catch((e) => {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error retrieving Article with id=' + id });
      articleLogger.error(`Error getting article`);
    });
};

// Update a Article by the id in the request
const update = (req: express.Request, res: express.Response) => {
  const { error } = articlePostValidation(req.body);
  if (error) {
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(error.details[0].message));
  }
  try {
    const id = req.params['id'];

    mongoArticleFindByIdandUpdate(id, req)
      .then((data) => {
        if (!data) {
          const returnMessage = `Cannot update Article with id=${id}. Maybe Article was not found!`;
          articleLogger.error(returnMessage);
          res.status(HttpStatusCode.NOT_FOUND).send({
            message: returnMessage
          });
        } else {
          res.send({ message: ArticleOperations.ARTICLE_UPDATED });
        }
      })
      .catch((err) => {
        articleLogger.error(err);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
          message: 'Error updating Article with id=' + id
        });
      });
  } catch (e) {
    res.status(HttpStatusCode.CONFLICT).send(e);
  }
};

// Delete a Article with the specified id in the request
const deleteOne = (req: express.Request, res: express.Response) => {
  const id = req.params['id'];
  mongoArticleDeleteById(id)
    .then((data) => {
      if (!data) {
        res.status(HttpStatusCode.NOT_FOUND).send({
          message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
        });
      } else {
        res.send({
          message: ArticleOperations.ARTICLE_DELETED
        });
      }
    })
    .catch((err) => {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: 'Could not delete Article with id=' + id
      });
    });
};

// Delete all Articles from the database.
const deleteAll = (req: express.Request, res: express.Response) => {
  mongoArticleDeleteAll()
    .then((data) => {
      res.send({
        message: `${data.deletedCount} ${ArticleOperations.ARTICLES_DELETED}`
      });
    })
    .catch((err) => {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: err.message || ArticleOperations.ERROR_ARTICLES_GET
      });
    });
};

// Find all published Articles
const findAllPublished = (req: express.Request, res: express.Response) => {
  mongoArticleFindWhere({ cr_parsed: true })
    .then((data) => {
      res.send(serializer.serialize('article', data));
    })
    .catch((err) => {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: err.message || ArticleOperations.ERROR_ARTICLES_GET
      });
    });
};

export default {
  create,
  update,
  findAll,
  findOne,
  deleteOne,
  deleteAll,
  findAllPublished
};
