import articleLogger from '../loggers/article.logger';
import { addArticle } from '../queues/article.queue';
import { mongoArticleDeleteAll, mongoArticleDeleteById, mongoArticleFindById, mongoArticleFindByIdandUpdate,
  mongoArticleFindWhere, mongoCheckArticleExistsByDOI } from '../requests/mongoose.service';
import { articlePostValidation, articleSingleValidation } from '../validation/article.validation';
import serializer from '../validation/json.validation';

exports.create = async (req, res) => {
  // Validate request
  const {error} = articlePostValidation(req.body);
  if (error) {
    const errorArticleValidation = error.details;
    articleLogger.error(errorArticleValidation);
    return res.status(400).send(serializer.serializeError(errorArticleValidation));
  }

  // check to see if already exists
  const exists = await mongoCheckArticleExistsByDOI(req.body.doi);
  if (exists) {
    // Generate Error Message if article exists.
    const errorArticleExists =
      new Error(`The Article with the DOI ${req.body.doi} already exists`);
    articleLogger.error(errorArticleExists);
    return res.status(400).send(serializer.serializeError(errorArticleExists));
  }
  const ArticleData = {
    doi: req.body.doi,
    print_issn: req.body.print_issn,
    electronic_issn: req.body.electronic_issn,
  };
  addArticle(ArticleData);
  res.status(200).send({message: 'The worker is working on it'});
  articleLogger.info(`The creation request for ${req.body.doi} is being processed`);
};

// Retrieve all Articles from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ?
  {title: {$regex: new RegExp(title), $options: 'i'}} : {};

  mongoArticleFindWhere(condition)
      .then((data) => {
        res.send(serializer.serialize('article', data));
      })
      .catch((err) => {
        articleLogger.error(err);
        res.status(500).send({
          message:
          serializer.serializeError(
              err.message || process.env.STRING_ERROR_ARTICLES_GET),
        });
      });
};

// Find a single Article with an id
exports.findOne = (req, res) => {
  // Validate request
  const {error} = articleSingleValidation(req.params);
  if (error) {
    articleLogger.error(error.details[0].message);
    return res.status(400).send(serializer.serializeError(error.details[0].message));
  }
  
  const id = req.params.id;
  mongoArticleFindById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({message: 'Not found Article with id ' + id});
        } else res.send(serializer.serialize('article', data));
      })
      .catch((e) => {
        res
            .status(500)
            .send({message: 'Error retrieving Article with id=' + id});
        articleLogger.error(`Error getting article`);
      });
};

// Update a Article by the id in the request
exports.update = (req, res) => {
  const {error} = articlePostValidation(req.body);
  if (error) {
    return res.status(400)
        .send(serializer.serializeError(error.details[0].message));
  }
  try {
    const id = req.params.id;

    mongoArticleFindByIdandUpdate(id, req)
        .then((data) => {
          if (!data) {
            let message = `Cannot update Article with id=${id}. Maybe Article was not found!`
            articleLogger.error(message);
            res.status(404).send({
              message: message,
            });
          } else res.send({message: process.env.STRING_ARTICLE_UPDATED});
        })
        .catch((err) => {
          articleLogger.error(err)
          res.status(500).send({
            message: 'Error updating Article with id=' + id,
          });
        });
  } catch (e) {
    res.status(400).send(e);
  }
};

// Delete a Article with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  mongoArticleDeleteById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message:
            `Cannot delete Article with id=${id}. Maybe Article was not found!`,
          });
        } else {
          res.send({
            message: process.env.STRING_ARTICLE_DELETED,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Could not delete Article with id=' + id,
        });
      });
};

// Delete all Articles from the database.
exports.deleteAll = (req, res) => {
  mongoArticleDeleteAll()
      .then((data) => {
        res.send({
          message:
          data.deletedCount + ' ' + process.env.STRING_ARTICLES_DELETED,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || process.env.STRING_ERROR_ARTICLES_GET,
        });
      });
};


// Find all published Articles
exports.findAllPublished = (req, res) => {
  mongoArticleFindWhere({cr_parsed: true})
      .then((data) => {
        res.send(serializer.serialize('article', data));
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || process.env.STRING_ERROR_ARTICLES_GET,
        });
      });
};

