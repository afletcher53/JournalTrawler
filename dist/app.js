"use strict";
// load ENV file
require('dotenv').config();
const { systemLogger } = require('./logger');
const express = require('express');
const app = express();
const db = require('./app/models');
const { addArticle } = require('./app/queues/article.queue');
// Middlewares
app.use(require('./middleware'));
db.mongoose
    .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    systemLogger.info('Connected to the database!');
})
    .catch((err) => {
    systemLogger.error('Cannot connect to the database!', err);
    process.exit();
});
// Main route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Internal MongoDB API application.' });
});
// Main route
app.get('/add-article', async (req, res) => {
    await addArticle('hello');
    res.send({ status: 'ok' });
});
// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
module.exports = app;
