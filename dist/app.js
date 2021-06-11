"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load ENV file
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const logger_1 = require("./app/loggers/logger");
const models_1 = __importDefault(require("./app/models"));
const wipe_data_1 = __importDefault(require("./app/scripts/wipe-data"));
const app = express_1.default();
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
// Main route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to the server" });
});
// Nuclear wipe 
app.get('/nuclearwipe', (req, res) => {
    wipe_data_1.default();
    res.json({ "message": "Everything has been wipped" });
});
// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);
exports.default = app;
//# sourceMappingURL=app.js.map