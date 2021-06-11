"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = require("../config/db.config");
const db = {
    journals: require('./journal.model').default(mongoose_1.default),
    integrity: require('./integrity.model').default(mongoose_1.default),
    articles: require('./article.model').default(mongoose_1.default),
    mongoose: mongoose_1.default,
    url: db_config_1.url
};
if (process.env.NODE_ENV == 'test') {
    db.url = db_config_1.testurl;
}
else {
    db.url = db_config_1.url;
}
exports.default = db;
//# sourceMappingURL=index.js.map