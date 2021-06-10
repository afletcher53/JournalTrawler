/* eslint-disable no-invalid-this */
export default (mongoose) => {
  // eslint-disable-next-line new-cap
  const schema = mongoose.Schema(
      {
        title: String,
        abstract: String,
        doi: String,
        journal_issn_print: String,
        journal_issn_electronic: String,
        crossref_url: String,
        tags: String,
        publisher: String,
        reference_count: Number,
        is_referenced_by_count: Number,
        type: String,
        url: String,
        published_online: Date,
        published_print: Date,
        license: String,
        cr_parsed: Boolean,
      },
      {timestamps: true},
  );
  schema.method('toJSON', function() {
    // eslint-disable-next-line no-unused-vars
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
  });

  const Article = mongoose.model('article', schema);
  return Article;
};
