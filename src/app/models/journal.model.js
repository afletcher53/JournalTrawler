const { number } = require("@hapi/joi");

module.exports = (mongoose) => {
  // eslint-disable-next-line new-cap
  const schema = mongoose.Schema(
      {
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
      },
      {timestamps: true},
  );

  mongoose.set('debug', true);
  schema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
  });

  const Journal = mongoose.model('journal', schema);
  return Journal;
};
