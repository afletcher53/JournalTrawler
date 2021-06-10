const JSONAPISerializer = require('jsonapi-serializer').Serializer;
import { createSchemaList } from '../app/formatting/general';
import { Request, Response, NextFunction } from 'express';
import db from '../app/models';
const Journal = db.journals;
const Article = db.articles;

/**
 * Capitalizes the first letter of a string
 * @param {String} string input string
 * @return {string} String with capitalized first letter
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Interceptor middleware function
 * which converts data response to a accepted JSON format
 * @param {*} req request from the API
 * @param {*} res response to the request
 * @param {*} next proceeds to the next function
 */
export function modifyResponseBody(req, res, next) { //TODO specify function types here
  let modelName = capitalizeFirstLetter(req.originalUrl
      .replace(process.env.API_PREFIX, '').split('/')[0]).split('s')[0];

  const JournalSerializer = new JSONAPISerializer(modelName, {
    attributes: createSchemaList(Journal),
  });
  const ArticleSerializer = new JSONAPISerializer(modelName, {
    attributes: createSchemaList(Article),
  });

  const oldSend = res.send;
  res.send = function(data) {
    let serialisedData = data;
    if (modelName = 'Journal') {
      serialisedData = JSON
          .stringify(JournalSerializer.serialize(data));
    }

    if (modelName = 'Article') {
      serialisedData = JSON
          .stringify(ArticleSerializer.serialize(data));
    }
    res.setHeader('Content-Type', process.env.CONTENT_TYPE);
    arguments[0] = serialisedData;
    oldSend.apply(res, arguments);
  };
  next();
}

module.exports= modifyResponseBody;
