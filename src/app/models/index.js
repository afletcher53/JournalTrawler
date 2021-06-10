const dbConfig = require('../config/db.config.js');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);
const db = {};
db.mongoose = mongoose;
if (process.env.NODE_ENV=='test') {
  db.url = dbConfig.testurl;
} else {
  db.url = dbConfig.url;
}
db.journals = require('./journal.model.js')(mongoose);
db.integrity = require('./integrity.model.js')(mongoose);
db.articles = require('./article.model.js')(mongoose);
module.exports = db;
