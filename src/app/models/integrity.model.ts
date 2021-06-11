//* * Model for data integrity check **//


export default (mongoose) => {
  // eslint-disable-next-line new-cap
  const schema = mongoose.Schema(
      {
        code: Number,
        message: String,
        data: Object,
        journal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'journal'
        }
      },
      {timestamps: true},
  );

  schema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
  });
  schema.set('debug', true);
  const Integrity = mongoose.model('integrity', schema);
  return Integrity;
};
