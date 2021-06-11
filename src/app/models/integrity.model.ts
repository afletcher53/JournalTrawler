//* * Model for data integrity check **//

import { mongoDBLogger } from "../loggers/logger";


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
  
  schema.post('init', function(doc) {
    mongoDBLogger.info(doc._id + 'Integrity has been initialized from the db');
  });
  schema.post('validate', function(doc) {
    mongoDBLogger.info(doc._id + 'Integrity has been validated but not saved');
  });
  schema.post('save', function(doc) {
    mongoDBLogger.info(doc._id + 'Integrity has been saved');
  });
  schema.post('remove', function(doc) {
    mongoDBLogger.info(doc._id + 'Integrity has been removed');
  }); 
  
  const Integrity = mongoose.model('integrity', schema);
  return Integrity;
};
