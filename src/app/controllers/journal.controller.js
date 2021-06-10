import db from '../models';
export const Journal = db.journals;
import {journalPostValidation,
  journalSingleValidation,
  journalMultipleValidation} from '../validation/journal.validation';
import serializer from '../validation/json.validation';
import {checkExists, getJournalData} from '../validation/crossref.validation';
import {createErrorExists, createErrorExistsCrossRef, createErrorGeneric}
  from '../validation/error.validation';

import postJournalByISSN from '../requests/internal.functions.requests';
import {addJournal} from '../queues/journal.queue';
import { findJournal } from './functions/findJournal';

const {getJournalByISSN} = require('./functions/getJournalByISSN');

// Create and Save a new Journal
exports.create = async (req, res) => {
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
  // Validate request
  const {error} = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };

  // check to see if already exists in MongooseDB
  const checkJournalExistsMongoDB = await getJournalByISSN(req.body.issn);
  if (checkJournalExistsMongoDB) {
    return res.status(400)
        .send(createErrorExists(req.body.issn, 'Journal'));
  };

  // check to see if ISSN exists on crossref
  const checkCrossRefExists = await checkExists(req.body.issn);
  if (!checkCrossRefExists) {
    return res.status(400)
        .send(createErrorExistsCrossRef(req.body.issn, 'Journal'));
  }
  // get the data from crossref
  const journalData = await getJournalData(req.body.issn);
  // save the journal
  try {
    const journal = new Journal(journalData);
    journal
        .save(journal.data)
        .then((data) => {
          const journalISSN = {
            issn: req.body.issn,
          };
          addJournal(journalISSN);
          res.send(serializer.serialize('journal', data));
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || createErrorGeneric,
          });
        });

    // spawn a job that will parse the article for DOIs.
  } catch (err) {
    res.status(400).send({
      message:
      err.message || createErrorGeneric(),
    });
  }
};

// Retrieve all Journals from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  const condition = title ?
  {title: {$regex: new RegExp(title), $options: 'i'}} : {};
  Journal.find(condition)
      .then((data) => {
        res.send(serializer.serialize('journal', data));
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || createErrorGeneric(),
        });
      });
};

// DONE UP TO HERE

// Find a single Journal with an id
exports.findOne = (req, res) => {
  // check to see if has ISSN format OR mongoDBID format
  const issn = req.params.id;
  const isISSN = /\b\d{3}[0-9]-\d{3}[0-9]\b/.test(issn);

  if (isISSN) {
    try {
      findJournal(issn, res);
    } catch (e) {
      res.status(400).send({
        message:
         createErrorGeneric(),
      });
    }
  } else {
  // MongoDB format
    const {error} = journalSingleValidation(req.params);
    // const isISSN = /\b\d{3}[0-9]-\d{3}[0-9]\b/.test(req.params.id);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      Journal.findById(req.params.id)
          .then((data) => {
            if (!data) {
              res.status(404).send(
                  {message: 'Not found Journal with id ' + req.params.id});
            } else res.send(serializer.serialize('journal', data));
          })
          .catch((err) => {
            res.status(500).send(
                {message: 'Error retrieving Journal with id=' + req.params.id});
          });
    } catch (e) {
      res.status(400).send({
        message:
      err.message || createErrorGeneric(),
      });
    }
  }
};

// Update a Journal by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;

  Journal.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message:
            `Cannot update Journal with id=${id}.
             Maybe Journal was not found!`,
          });
        } else res.send({message: 'Journal was updated successfully.'});
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Journal with id=' + id,
        });
      });
};

// Delete a Journal with the specified id in the request
exports.delete = (req, res) => {
  const {error} = journalSingleValidation( req.params);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    Journal.findByIdAndRemove(id, {useFindAndModify: false})
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message:
              `Cannot delete Journal with id=${id}.
               Maybe Journal was not found!`,
            });
          } else {
            res.send({
              message: 'Journal was deleted successfully!',
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: 'Could not delete Journal with id=' + id,
          });
        });
  } catch {
    res.status(400).send(e);
  }
};

// Delete all Journals from the database.
exports.deleteAll = (req, res) => {
  Journal.deleteMany({})
      .then((data) => {
        res.send({
          message: `${data.deletedCount} Journals were deleted successfully!`,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while removing all Journals.',
        });
      });
};

// Find all published Journals
exports.findAllPublished = (req, res) => {
  Journal.find({published: true})
      .then((data) => {
        res.send(serializer.serialize('journal', data));
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while retrieving Journals.',
        });
      });
};

// Find all Crossreff Synced Journals
exports.findAllCRScraped = (req, res) => {
  Journal.find({cr_parsed: true})
      .then((data) => {
        res.send(serializer.serialize('journal', data));
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while retrieving Journals.',
        });
      });
};

// Find all Crossreff Synced Journals
exports.findAllCRUnscraped = (req, res) => {
  Journal.find({cr_parsed: false})
      .then((data) => {
        res.send(serializer.serialize('journal', data));
      })
      .catch((err) => {
        res.status(500).send({
          message:
          err.message || 'Some error occurred while retrieving Journals.',
        });
      });
};


exports.bulkAdd = async (req, res) => {
  const {error} = journalMultipleValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  req.body.issns.forEach((e)=> {
    postJournalByISSN(e);
  },
  );
  res.status(200).send({
    message:
    // eslint-disable-next-line max-len
    'These journals have been added, you cannot see the status of these journals',
  });
};


