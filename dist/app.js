"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const system_logger_1 = __importDefault(require("./app/loggers/system.logger"));
const models_1 = __importDefault(require("./app/models"));
const articles_routes_1 = __importDefault(require("./app/routes/articles.routes"));
const journals_routes_1 = __importDefault(require("./app/routes/journals.routes"));
const integrities_routes_1 = __importDefault(require("./app/routes/integrities.routes"));
const scripts_routes_1 = __importDefault(require("./app/routes/scripts.routes"));
const app = express_1.default();
// Middlewares
app.use(require('./middleware'));
models_1.default.mongoose
    .connect(models_1.default.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    system_logger_1.default.info('Connected to the database!');
})
    .catch((err) => {
    system_logger_1.default.error('Cannot connect to the database!', err);
    process.exit();
});
// Main route
app.get('/', (req, res) => {
    res.json({ 'message': 'Welcome to the server' });
});
articles_routes_1.default(app);
integrities_routes_1.default(app);
journals_routes_1.default(app);
scripts_routes_1.default(app);
exports.default = app;
