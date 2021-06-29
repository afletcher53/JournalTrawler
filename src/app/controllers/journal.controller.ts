
import {
  mongoDeleteAllJournals, mongofetchJournalByISSN,
  mongoFindJournalById, mongoFindJournalByIdAndRemove, mongoFindJournalByIdAndUpdate, mongoFindJournalWhere, mongoSaveJournal
} from '../requests/mongoose.service';
import getJournalData from '../validation/functions/getJournalData';
import checkExists from '../validation/functions/checkCrossrefJournalExists';
import { createErrorExistsCrossRef } from '../validation/error.validation';
import {
  journalPostValidation,
  journalSingleValidation
} from '../validation/journal.validation';
import serializer from '../validation/json.validation';
import HttpStatusCode from '../Typescript/Enums/HttpStatusCode.enum';
import StringLiterals from '../Typescript/Enums/StringLiterals.enum';
import mongoDBLogger from '../loggers/mongoDB.logger';
import checkDOAJJournalExistsDOAJ from '../validation/functions/checkDOAJJournalExists';
import { addJournal } from '../queues/journal.queue';



// Create and Save a new Journal
const create = async (req, res) => {
  if (req.body.issn) {
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
  }
  //  Validate request
  const { error } = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(errorJournalValidation));
  }

  //  Check to see if already exists in MongooseDB
  // const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(req.body.issn);
  // if (checkJournalExistsMongoDB) {
  //   return res.status(HttpStatusCode.CONFLICT)
  //       .send(createErrorExists(req.body.issn, 'Journal'));
  // }

  // Check to see if ISSN exists on crossref
  const checkCrossRefExists = await checkExists(req.body.issn);
  if (!checkCrossRefExists) {
    return res.status(HttpStatusCode.CONFLICT)
      .send(createErrorExistsCrossRef(req.body.issn, 'Journal'));
  }
  // Get the data from crossref
  const journalData = await getJournalData(req.body.issn);

  //check to see if the journal is supported by DOAJ
  journalData.abstract_source_doaj = await checkDOAJJournalExistsDOAJ(req.body.issn);


  // save the journal
  mongoSaveJournal(journalData)
      .then((data) => {
        const journalISSN = {
             journal_id: data._id,
             issn: req.body.issn,
        };
        addJournal(journalISSN);

        res.send(serializer.serialize('journal', data));
      })
      .catch((err) => {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
          message:
            err.message || StringLiterals.GENERIC_ERROR,
        });
      });
};




// Retrieve all Journals from the database.
const findAll = async (req, res) => {
  const title = req.query.title;
  const condition = title ? { title: { $regex: new RegExp(title), $options: 'i' } } : {};

  mongoFindJournalWhere(condition)
    .then((data) => {
      res.send(serializer.serialize('journal', data));
    })
    .catch((err) => {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message:
          err.message || StringLiterals.GENERIC_ERROR,
      });
    });
};

// Find a single Journal with an id
const findOne = async (req, res) => {
  // check to see if has ISSN format OR mongoDBID format
  const issn = req.params.id;
  const isISSN = /\b\d{3}[0-9]-\d{3}[0-9]\b/.test(issn);

  if (isISSN) {
    try {
      await mongofetchJournalByISSN(issn).then((data) => {
        if (!data) {
          res.status(HttpStatusCode.NOT_FOUND).send(
            { message: 'Not found Journal with id ' + req.params.id });
        } else {
          res.send(serializer.serialize('journal', data));
        }
      })
        .catch((err) => {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(
            { message: 'Error retrieving Journal with id=' + req.params.id });
        });
    } catch (e) {
      res.status(HttpStatusCode.CONFLICT).send({
        message: StringLiterals.GENERIC_ERROR,
      });
    }
  } else {

    const { error } = journalSingleValidation(req.params);
    if (error) {
      return res.status(HttpStatusCode.CONFLICT).send(error.details[0].message);
    }
    try {
      mongoFindJournalById(req.params.id)
        .then((data) => {
          if (!data) {
            res.status(HttpStatusCode.NOT_FOUND).send(
              { message: 'Not found Journal with id ' + req.params.id });
          } else {
            res.send(serializer.serialize('journal', data));
          }
        })
        .catch((err) => {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(
            { message: 'Error retrieving Journal with id=' + req.params.id });
        });
    } catch (e) {
      res.status(HttpStatusCode.CONFLICT).send({
        message:
          e.message || StringLiterals.GENERIC_ERROR,
      });
    }
  }
};

// Update a Journal by the id in the request
const update = (req, res) => {
  if (!req.body) {
    return res.status(HttpStatusCode.CONFLICT).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;

  mongoFindJournalByIdAndUpdate(id, req)
    .then((data) => {
      if (!data) {
        res.status(HttpStatusCode.NOT_FOUND).send({
          message:
            `Cannot update Journal with id=${id}.
             Maybe Journal was not found!`,
        });
      } else {
        res.send({ message: 'Journal was updated successfully.' });
      }
    })
    .catch((err) => {
      mongoDBLogger.error(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: 'Error updating Journal with id=' + id,
      });
    });
};

// Delete a Journal with the specified id in the request
const deleteOne = (req, res) => {
  const { error } = journalSingleValidation(req.params);
  if (error) {
    return res.status(HttpStatusCode.CONFLICT).send(error.details[0].message);
  }

  try {
    mongoFindJournalByIdAndRemove(req)
      .then((data) => {
        if (!data) {
          res.status(HttpStatusCode.NOT_FOUND).send({
            message:
              `Cannot delete Journal with id=${req.params.id}.
               Maybe Journal was not found!`,
          });
        } else {
          res.send({
            message: 'Journal was deleted successfully!',
          });
        }
      })
      .catch((err) => {
        mongoDBLogger.error(err);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
          message: 'Could not delete Journal with id=' + req.parms.id,
        });
      });
  } catch (e) {
    res.status(HttpStatusCode.CONFLICT).send(e);
  }
};

// Delete all Journals from the database.
const deleteAll = (req, res) => {
  mongoDeleteAllJournals()
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Journals were deleted successfully!`,
      });
    })
    .catch((err) => {
      mongoDBLogger.error(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message:
          err.message || 'Some error occurred while removing all Journals.',
      });
    });
};

// Find all published Journals
const findAllPublished = (req, res) => {
  mongoFindJournalWhere({ published: true })
    .then((data) => {
      res.send(serializer.serialize('journal', data));
    })
    .catch((err) => {
      mongoDBLogger.error(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message:
          err.message || StringLiterals.GENERIC_ERROR,
      });
    });
};

// Find all Crossreff Synced Journals
const findAllCRScraped = (req, res) => {
  mongoFindJournalWhere({ cr_parsed: true })
    .then((data) => {
      res.send(serializer.serialize('journal', data));
    })
    .catch((err) => {
      mongoDBLogger.error(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message:
          err.message || StringLiterals.GENERIC_ERROR,
      });
    });
};

// Find all Crossreff Synced Journals
const findAllCRUnscraped = (req, res) => {
  mongoFindJournalWhere({ cr_parsed: false })
    .then((data) => {
      res.send(serializer.serialize('journal', data));
    })
    .catch((err) => {
      mongoDBLogger.error(err);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message:
          err.message || StringLiterals.GENERIC_ERROR,
      });
    });
};

export default {
  create,
  findAll,
  findOne,
  update,
  deleteAll,
  findAllPublished,
  findAllCRScraped,
  findAllCRUnscraped,
  deleteOne,

};
