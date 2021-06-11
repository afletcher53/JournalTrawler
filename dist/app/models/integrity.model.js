"use strict";
//* * Model for data integrity check **//
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../loggers/logger");
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
        logger_1.mongoDBLogger.info(doc._id + 'Integrity has been initialized from the db');
    });
    schema.post('validate', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Integrity has been validated but not saved');
    });
    schema.post('save', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Integrity has been saved');
    });
    schema.post('remove', function (doc) {
        logger_1.mongoDBLogger.info(doc._id + 'Integrity has been removed');
    });
    const Integrity = mongoose.model('integrity', schema);
    return Integrity;
};
//# sourceMappingURL=integrity.model.js.map