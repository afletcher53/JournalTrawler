const dbConfig = require('../config/db.config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
if (process.env.NODE_ENV == 'test') {
    db.url = dbConfig.testurl;
}
else {
    db.url = dbConfig.url;
}
db.journals = require('./journal.model').default(mongoose);
db.integrity = require('./integrity.model').default(mongoose);
db.articles = require('./article.model').default(mongoose);
module.exports = db;
