/* eslint-disable no-invalid-this */
import mongoosastic from 'mongoosastic';
import config from '../config/elasticsearch.config';
import articleLogger from '../loggers/article.logger';
// import mongoDBLogger from '../loggers/mongoDB.logger';
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
    },
    { timestamps: true }
  );
  schema.method('toJSON', function () {
    // eslint-disable-next-line no-unused-vars
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  // schema.post('init', function (doc) {
  //   mongoDBLogger.info(`${doc._id} Article has been initialized from the db`);
  // });
  // schema.post('validate', function (doc) {
  //   mongoDBLogger.info(`${doc._id} Article has been validated but not saved`);
  // });
  // schema.post('save', function (doc) {
  //   mongoDBLogger.info(`${doc._id} Article has been saved`);
  // });
  // schema.post('remove', function (doc) {
  //   mongoDBLogger.info(`${doc._id} Article has been removed`);
  // });
  schema.plugin(mongoosastic, config);

  const Article = mongoose.model('article', schema);
  const stream = Article.synchronize();
  Article.synchronize();
  stream.on('error', function (err) {
    articleLogger.info(`Error while synchronizing ${err}`);
  });
  // stream.on('data', function (err, doc) {
  //   articleLogger.info('indexing: done');
  // });
  return Article;
};
