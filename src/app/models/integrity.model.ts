//* * Model for data integrity check **//

import mongoosastic from 'mongoosastic';
import config from '../config/elasticsearch.config';
import mongoDBLogger from '../loggers/mongoDB.logger';
// import systemLogger from '../loggers/system.logger';

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
    { timestamps: true }
  );

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.post('init', function (doc) {
    mongoDBLogger.info(`${doc._id} Integrity has been initialized from the db`);
  });
  schema.post('validate', function (doc) {
    mongoDBLogger.info(`${doc._id} Integrity has been validated but not saved`);
  });
  schema.post('save', function (doc) {
    mongoDBLogger.info(`${doc._id} Integrity has been saved`);
  });
  schema.post('remove', function (doc) {
    mongoDBLogger.info(`${doc._id} Integrity has been removed`);
  });

  schema.plugin(mongoosastic, config);
  const Integrity = mongoose.model('integrity', schema);
  // const stream = Integrity.synchronize(); //TODO : Fix synchronisation issue:  reason: 'mapper [data.dataBreakdown.percentage] cannot be changed from type [float] to [long]'

  // stream.on('error', function (err) {
  //   systemLogger.error("Error while synchronizing" + err);
  // });
  // stream.on('data', function (err, doc) {
  //   systemLogger.info('indexing: done');
  // });
  return Integrity;
};
