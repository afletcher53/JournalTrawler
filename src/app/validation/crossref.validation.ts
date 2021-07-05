import Joi from '@hapi/joi';
import express from 'express';

const options = {
  abortEarly: false,
  allowUnknown: true,
  errors: {
    wrap: {
      label: ''
    }
  }
};
/**
 * Validate the response of getting a single article from Crossref API
 * @param data express resposne from API
 * @returns Error if doesnt match
 */
export const articleCrossRefResponseValidation = (data: express.Response) => {
  const schema = Joi.object({
    message: Joi.object().keys({
      title: Joi.required(),
      DOI: Joi.required(),
      abstract: Joi.string(),
      publisher: Joi.required(),
      'reference-count': Joi.required(),
      'is-referenced-by-count': Joi.required(),
      type: Joi.required(),
      URL: Joi.required()
    })
  });
  return schema.validate(data, options);
};
