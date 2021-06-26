import Joi from '@hapi/joi';
import express from 'express';

const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};


// Article Post Validation
export const articlePostValidation = (data: express.Request) => {
  const minStringValue = 6;
  const schema = Joi.object({
    print_issn:
      Joi.string()
        .min(0)
        .required(),
    electronic_issn:
      Joi.string()
        .min(0)
        .required(),
    doi:
      Joi.string()
        .min(minStringValue)
        .required(),

  });
  return schema.validate(data, options);
};

export const articleSingleValidation = (data: express.Request) => {
  const minStringValue = 6;
  const schema = Joi.object({
    id:
      Joi
        .string()
        .required()
        .min(minStringValue),
  });

  return schema.validate(data, options);
};
