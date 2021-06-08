const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const { createSchemaList } = require('../app/formatting/general');
const db = require('../app/models');
const Journal = db.journals;
const Article = db.articles;
/**
 * Capitalizes the first letter of a string
 * @param {String} string input string
 * @return {string} String with capitalized first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * Interceptor middleware function
 * which converts data response to a accepted JSON format
 * @param {*} req request from the API
 * @param {*} res response to the request
 * @param {*} next proceeds to the next function
 */
function modifyResponseBody(req, res, next) {
    // need to determine the route which was used
    let modelName = capitalizeFirstLetter(req.originalUrl
        .replace(process.env.API_PREFIX, '').split('/')[0]).split('s')[0];
    const JournalSerializer = new JSONAPISerializer(modelName, {
        attributes: createSchemaList(Journal),
    });
    const ArticleSerializer = new JSONAPISerializer(modelName, {
        attributes: createSchemaList(Article),
    });
    const oldSend = res.send;
    res.send = function (data) {
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
module.exports = modifyResponseBody;
