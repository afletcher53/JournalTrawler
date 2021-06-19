import { addJournal } from '../queues/journal.queue';
import { mongoCheckJournalExistsByISSN, mongoDeleteAllJournals, mongofetchJournalByISSN, mongoFindJournalById, mongoFindJournalByIdAndRemove, mongoFindJournalByIdAndUpdate, mongoFindJournalWhere, mongoSaveJournal } from '../requests/mongoose.service';
import { checkExists, getJournalData } from '../validation/crossref.validation';
import { createErrorExists, createErrorExistsCrossRef, createErrorGeneric } from '../validation/error.validation';
import {
  journalPostValidation,
  journalSingleValidation
} from '../validation/journal.validation';
import serializer from '../validation/json.validation';



// Create and Save a new Journal
exports.create = async (req, res) => {
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');

  //  Validate request
  const {error} = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };

  //  Check to see if already exists in MongooseDB
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(req.body.issn);
  if (checkJournalExistsMongoDB) {
    return res.status(400)
        .send(createErrorExists(req.body.issn, 'Journal'));
  };

  // Check to see if ISSN exists on crossref
  const checkCrossRefExists = await checkExists(req.body.issn);
  if (!checkCrossRefExists) {
    return res.status(400)
        .send(createErrorExistsCrossRef(req.body.issn, 'Journal'));
  }
  // Get the data from crossref
  const journalData = await getJournalData(req.body.issn);
  // save the journal
  try {
   
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
exports.findAll = async (req, res) => {
  const title = req.query.title;
  const condition = title ?  {title: {$regex: new RegExp(title), $options: 'i'}} : {};

  mongoFindJournalWhere(condition)
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

// Find a single Journal with an id
exports.findOne = async (req, res) => {
  // check to see if has ISSN format OR mongoDBID format
  const issn = req.params.id;
  const isISSN = /\b\d{3}[0-9]-\d{3}[0-9]\b/.test(issn);

  if (isISSN) {
    try {
     await mongofetchJournalByISSN(issn).then((data) => {
      if (!data) {
        res.status(404).send(
            {message: 'Not found Journal with id ' + req.params.id});
      } else res.send(serializer.serialize('journal', data));
    })
    .catch((err) => {
      res.status(500).send(
          {message: 'Error retrieving Journal with id=' + req.params.id});
    });;
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
      mongoFindJournalById(req)
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
      e.message || createErrorGeneric(),
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

  mongoFindJournalByIdAndUpdate(id, req)
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
    mongoFindJournalByIdAndRemove(req)
        .then((data) => {
          if (!data) {
            res.status(404).send({
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
          res.status(500).send({
            message: 'Could not delete Journal with id=' + req.parms.id,
          });
        });
  } catch (e) {
    res.status(400).send(e);
  }
};

// Delete all Journals from the database.
exports.deleteAll = (req, res) => {
  mongoDeleteAllJournals()
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
  mongoFindJournalWhere({ published: true })
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
  mongoFindJournalWhere({cr_parsed: true})
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
  mongoFindJournalWhere({cr_parsed: false})
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
