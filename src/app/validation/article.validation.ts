import Joi from '@hapi/joi';

const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};


// Article Post Validation
export const articlePostValidation = (data: Express.Request) => {
  const schema = Joi.object({
    print_issn:
            Joi.string()
                .min(6)
                .required(),
    electronic_issn:
            Joi.string()
                .min(6),
    doi:
            Joi.string()
                .min(6)
                .required(),

  });
  return schema.validate(data, options);
};

export const articleSingleValidation = (data: Express.Request) => {
  const schema = Joi.object({
    id:
          Joi
              .string()
              .required()
              .min(6),
  });

  return schema.validate(data, options);
};
