//* * Model for data integrity check **//
module.exports = (mongoose) => {
    // eslint-disable-next-line new-cap
    const schema = mongoose.Schema({
        code: Number,
        message: String,
        data: Object,
    }, { timestamps: true });
    // mongoose.set('debug', true);
    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    const Integrity = mongoose.model('integrity', schema);
    return Integrity;
};
