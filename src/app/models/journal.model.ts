import mongoosastic from 'mongoosastic';
import config from '../config/elasticsearch.config';
import mongoDBLogger from '../loggers/mongoDB.logger';
import systemLogger from '../loggers/system.logger';
export default (mongoose) => {
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
      abstract_source_doaj: Boolean,

    },
    { timestamps: true }
  );


  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.post('init', function (doc) {
    mongoDBLogger.info(doc._id + 'Journal has been initialized from the db');
  });
  schema.post('validate', function (doc) {
    mongoDBLogger.info(doc._id + 'Journal has been validated but not saved');
  });
  schema.post('save', function (doc) {
    mongoDBLogger.info(doc._id + 'Journal has been saved');
  });
  schema.post('remove', function (doc) {
    mongoDBLogger.info(doc._id + 'Journal has been removed');
  });
  schema.plugin(mongoosastic, config);
  const Journal = mongoose.model('journal', schema);
  const stream = Journal.synchronize();
  stream.on('error', function (err) {
    systemLogger.error(`Error while synchronizing ${err}`);
  });
  stream.on('data', function (err, doc) {
    systemLogger.info('indexing: done');
  });
  return Journal;
};
