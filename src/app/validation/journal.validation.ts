import express from 'express';
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const minStringLength = 6;

export const journalPostValidation = (data: express.Request) => {
  const pattern = /\b[\S]{4}\-[\S]{4}\b/;
  const schema = Joi.object({
    issn: Joi.string()
      .min(minStringLength)
      .pattern(new RegExp(pattern))
      .required(),
    title: Joi.string().min(minStringLength),
    id: Joi.string()
  });
  return schema.validate(data);
};

export const journalSingleValidation = (data: express.Request) => {
  const schema = Joi.object({
    id: Joi.objectId().required(),

    publisher: Joi.string(),

    issn_electronic: Joi.string().min(minStringLength)
  });

  return schema.validate(data);
};
