const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

export const journalPostValidation = (data: Express.Request) => {
  const pattern = /\b[\S]{4}\-[\S]{4}\b/
  const schema = Joi.object({
    issn:
            Joi.string()
                .min(6)
                .pattern(new RegExp(pattern))
                .required(),
    title:
            Joi.string()
                .min(6),
    id:
            Joi.string(),

  });
  return schema.validate(data);
};

export const journalSingleValidation = (data: Express.Request) => {
  const schema = Joi.object({
    id:
          Joi
              .objectId()
              .required(),

    publisher:
        Joi
            .string(),

    issn_electronic:
          Joi
              .string()
              .min(6),
  });

  return schema.validate(data);
};

export const journalMultipleValidation = (data: Express.Request) => {
  const schema = Joi.object().keys({
    issns: Joi.array().items(Joi.string()),
  });
  return schema.validate(data);
};


export const journalISSNSingleValidation = (data: Express.Request) => {
  const schema = Joi.object({
    id:
          Joi
              .string()
              .required(),
  });

  return schema.validate(data);
};
