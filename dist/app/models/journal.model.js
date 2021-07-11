"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoosastic_1 = __importDefault(require("mongoosastic"));
const elasticsearch_config_1 = __importDefault(require("../config/elasticsearch.config"));
const mongoDB_logger_1 = __importDefault(require("../loggers/mongoDB.logger"));
const system_logger_1 = __importDefault(require("../loggers/system.logger"));
exports.default = (mongoose) => {
    const schema = mongoose.Schema({
        title: String,
        publisher: String,
        subject: String,
        url: String,
        issn: String,
        asjc: Number,
        issn_print: String,
        issn_electronic: String,
        counts_totaldois: Number,
        counts_currentdois: Number,
        counts_backfiledois: Number,
        cr_last_status_check_time: Date,
        cr_parsed: Boolean,
        abstract_source_doaj: Boolean,
        abstract_source_springer: Boolean
    }, { timestamps: true });
    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.post('init', function (doc) {
        mongoDB_logger_1.default.info(doc._id + 'Journal has been initialized from the db');
    });
    schema.post('validate', function (doc) {
        mongoDB_logger_1.default.info(doc._id + 'Journal has been validated but not saved');
    });
    schema.post('save', function (doc) {
        mongoDB_logger_1.default.info(doc._id + 'Journal has been saved');
    });
    schema.post('remove', function (doc) {
        mongoDB_logger_1.default.info(doc._id + 'Journal has been removed');
    });
    schema.plugin(mongoosastic_1.default, elasticsearch_config_1.default);
    const Journal = mongoose.model('journal', schema);
    const stream = Journal.synchronize();
    stream.on('error', function (err) {
        system_logger_1.default.error(`Error while synchronizing ${err}`);
    });
    stream.on('data', function (err, doc) {
        system_logger_1.default.info('indexing: done');
    });
    return Journal;
};
