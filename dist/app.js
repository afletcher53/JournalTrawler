"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// load ENV file
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const system_logger_1 = __importDefault(require("./app/loggers/system.logger"));
const models_1 = __importDefault(require("./app/models"));
const export_data_1 = __importDefault(require("./app/utils/export-data"));
const send_email_1 = __importDefault(require("./app/utils/send-email"));
const wipe_data_1 = __importDefault(require("./app/utils/wipe-data"));
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
// db.mongoose.set('debug', true);
// Main route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome to the server" });
});
// Nuclear wipe 
app.get('/nuclearwipe', (req, res) => {
    wipe_data_1.default();
    res.json({ "message": "Everything has been wipped" });
});
// Nuclear wipe 
app.get('/backup', (req, res) => {
    export_data_1.default();
    send_email_1.default();
    res.json({ "message": "Backups are being prepared" });
});
// Other routes
require('./app/routes/journals.routes')(app);
require('./app/routes/articles.routes')(app);
require('./app/routes/integrities.routes')(app);
exports.default = app;
