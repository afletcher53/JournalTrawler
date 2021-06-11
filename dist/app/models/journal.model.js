"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
exports.default = (mongoose) => {
    // eslint-disable-next-line new-cap
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
    }, { timestamps: true });
    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.post('init', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Journal has been initialized from the db');
    });
    schema.post('validate', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Journal has been validated but not saved');
    });
    schema.post('save', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Journal has been saved');
    });
    schema.post('remove', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Journal has been removed');
    });
    const Journal = mongoose.model('journal', schema);
    return Journal;
};
//# sourceMappingURL=journal.model.js.map