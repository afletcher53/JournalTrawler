"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load ENV file
require('dotenv').config();
const logger_1 = require("./logger");
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const models_1 = __importDefault(require("./app/models"));
const wipe_data_1 = __importDefault(require("./app/scripts/wipe-data"));
// Middlewares
app.use(require('./middleware'));
models_1.default.mongoose
    .connect(models_1.default.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    logger_1.systemLogger.info('Connected to the database!');
})
    .catch((err) => {
    logger_1.systemLogger.error('Cannot connect to the database!', err);
    process.exit();
});
models_1.default.mongoose.set('debug', true);
models_1.default.mongoose.set('debug', function (collectionName, method, query, doc) {
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
    query = collectionName + '.' + method + '(' + JSON.stringify(query) + ',' + JSON.stringify(doc) + ")";
    logger_1.mongoDBLogger.info(query);
});
// Main route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to the server" });
});
app.get('/test', (req, res) => {
    wipe_data_1.default();
});
// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);
exports.default = app;
