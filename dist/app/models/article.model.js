"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-invalid-this */
const mongoosastic_1 = __importDefault(require("mongoosastic"));
const elasticsearch_config_1 = __importDefault(require("../config/elasticsearch.config"));
const mongoDB_logger_1 = __importDefault(require("../loggers/mongoDB.logger"));
exports.default = (mongoose) => {
    // eslint-disable-next-line new-cap
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
        // eslint-disable-next-line no-unused-vars
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.post('init', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Article has been initialized from the db`);
    });
    schema.post('validate', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Article has been validated but not saved`);
    });
    schema.post('save', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Article has been saved`);
    });
    schema.post('remove', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Article has been removed`);
    });
    schema.plugin(mongoosastic_1.default, elasticsearch_config_1.default);
    const Article = mongoose.model('article', schema);
    var stream = Article.synchronize();
    stream.on('error', function (err) {
        console.log("Error while synchronizing" + err);
    });
    stream.on('data', function (err, doc) {
        console.log('indexing: done');
    });
    return Article;
};
