const db = require('../models');
const Journal = db.journals;
const {journalPostValidation, journalSingleValidation} =
require('../validation/journal.validation');
const serializer = require('../validation/json.validation');
const {checkExists, getJournalData} =
require('../validation/crossref.validation');
const {createErrorExists, createErrorExistsCrossRef,
  createErrorGeneric} = require('../validation/error.validation');
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function getJournalByISSN(data) {
  // const docCount = await Journal.countDocuments({issn_print: data, issn_electronic: data}).exec();
  // const docCount = await Journal.countDocuments({issn_electronic: data, issn_print: data}).exec();
  const docCount = await Journal.countDocuments({$or:[{issn_electronic: data},{issn_print: data}]}).exec();
  let value = false;
  if (docCount != 0) value = true;
  return value;
}

// Create and Save a new Journal
exports.create = async (req, res) => {
  // Validate request
  const {error} = journalPostValidation(req.body);

  // any errors then
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };


  // check to see if already exists
  const a = await getJournalByISSN(req.body.issn);
  if (a) return res.status(400).send(createErrorExists(req.body.issn, 'Journal'));

  // check to see if ISSN exists on crossref
  const checkCrossRefExists = await checkExists(req.body.issn);
  if (!checkCrossRefExists) return res.status(400).send(createErrorExistsCrossRef(req.body.issn, 'Journal'));
  // get the data from crossref
  const journalData = await getJournalData(req.body.issn);

  // save the journal
  try {
    const journal = new Journal(journalData);

    // Save Journal in the database
    journal
        .save(journal)
        .then((data) => {
          res.send(serializer.serialize('journal', data));
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || createErrorGeneric,
          });
        });
  } catch (e) {
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
  const {error} = journalSingleValidation(req.params);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    Journal.findById(req.params.id)
        .then((data) => {
          if (!data) {
            res.status(404).send({message: 'Not found Journal with id ' + id});
          } else res.send(serializer.serialize('journal', data));
        })
        .catch((err) => {
          res
              .status(500)
              .send({message: 'Error retrieving Journal with id=' + id});
        });
  } catch (e) {
    res.status(400).send({
      message:
      err.message || createErrorGeneric(),
    });
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

exports.bulkAdd = (req, res) => {

  // TODO : Validate a list of ISSNS through bulk adding
 console.log(req.body.issns)
 const {error} = journalSingleValidation(req.body.issns);
console.log(error)
 res.status(500).send({
  message: 'Some error occurred while retrieving Journals.',
});
}