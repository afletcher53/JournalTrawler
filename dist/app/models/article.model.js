"use strict";
/* eslint-disable no-invalid-this */
module.exports = (mongoose) => {
    // eslint-disable-next-line new-cap
    const schema = mongoose.Schema({
        title: String,
        abstract: String,
        doi: String,
        journal: String,
        tags: String,
    }, { timestamps: true });
    schema.method('toJSON', function () {
        // eslint-disable-next-line no-unused-vars
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const Article = mongoose.model('article', schema);
    return Article;
};
