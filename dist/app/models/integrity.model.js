"use strict";
//* * Model for data integrity check **//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoosastic_1 = __importDefault(require("mongoosastic"));
const elasticsearch_config_1 = __importDefault(require("../config/elasticsearch.config"));
const mongoDB_logger_1 = __importDefault(require("../loggers/mongoDB.logger"));
const system_logger_1 = __importDefault(require("../loggers/system.logger"));
exports.default = (mongoose) => {
    // eslint-disable-next-line new-cap
    const schema = mongoose.Schema({
        code: Number,
        message: String,
        data: Object,
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
    schema.post('init', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Integrity has been initialized from the db`);
    });
    schema.post('validate', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Integrity has been validated but not saved`);
    });
    schema.post('save', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Integrity has been saved`);
    });
    schema.post('remove', function (doc) {
        mongoDB_logger_1.default.info(`${doc._id} Integrity has been removed`);
    });
    schema.plugin(mongoosastic_1.default, elasticsearch_config_1.default);
    const Integrity = mongoose.model('integrity', schema);
    var stream = Integrity.synchronize();
    stream.on('error', function (err) {
        console.log("Error while synchronizing" + err);
    });
    stream.on('data', function (err, doc) {
        system_logger_1.default.info('indexing: done');
    });
    return Integrity;
};
