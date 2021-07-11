"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoosastic_1 = __importDefault(require("mongoosastic"));
const elasticsearch_config_1 = __importDefault(require("../config/elasticsearch.config"));
const article_logger_1 = __importDefault(require("../loggers/article.logger"));
exports.default = (mongoose) => {
    const schema = mongoose.Schema({
        title: String,
        abstract: String,
        doi: String,
        journal_issn_print: String,
        journal_issn_electronic: String,
        crossref_url: String,
        publisher: String,
        reference_count: Number,
        is_referenced_by_count: Number,
        type: String,
        url: String,
        published_online: Date,
        published_print: Date,
        license: String,
        cr_parsed: Boolean,
        journal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'journal'
        }
    }, { timestamps: true });
    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.plugin(mongoosastic_1.default, elasticsearch_config_1.default);
    const Article = mongoose.model('article', schema);
    const stream = Article.synchronize();
    Article.synchronize();
    stream.on('error', function (err) {
        article_logger_1.default.info(`Error while synchronizing ${err}`);
    });
    return Article;
};
