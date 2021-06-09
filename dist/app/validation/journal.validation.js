const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const journalPostValidation = (data) => {
    const schema = Joi.object({
        issn: Joi.string()
            // .pattern(new RegExp((/\b\d{3}[0-9]-\d{3}[0-9]\b/)))
            .min(6)
            .required(),
        title: Joi.string()
            .min(6),
        id: Joi.string(),
    });
    return schema.validate(data);
};
const journalSingleValidation = (data) => {
    const schema = Joi.object({
        id: Joi
            .objectId()
            .required(),
        publisher: Joi
            .string(),
        issn_electronic: Joi
            .string()
            .min(6),
    });
    return schema.validate(data);
};
const journalMultipleValidation = (data) => {
    const schema = Joi.object().keys({
        issns: Joi.array().items(Joi.string()),
    });
    return schema.validate(data);
};
const journalISSNSingleValidation = (data) => {
    const schema = Joi.object({
        id: Joi
            .string()
            .required(),
    });
    return schema.validate(data);
};
module.exports.journalPostValidation = journalPostValidation;
module.exports.journalSingleValidation = journalSingleValidation;
module.exports.journalISSNSingleValidation = journalISSNSingleValidation;
module.exports.journalMultipleValidation = journalMultipleValidation;
