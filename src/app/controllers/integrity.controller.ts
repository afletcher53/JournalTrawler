import db from '../models';
const Integrity = db.integrity;
const Journal = db.journals;
const Article = db.articles;
import serializer from '../validation/json.validation';
import express from 'express';
import { journalPostValidation, journalSingleValidation } from '../validation/journal.validation';

import { createErrorExists, createErrorGeneric } from '../validation/error.validation';
import { fetchDOIsFromISSN } from '../requests/crossref.service';
import { addIntegrity } from '../queues/integrity.queue';

// returns all integrities 
exports.findAll = async (req: express.Request, res: express.Response) => {
  Integrity.find()
      .then((data) => {
        res.send(serializer.serialize('integrity', data));
      })
      .catch((err) => {
        res.status(500).send({
          message:
          serializer.serializeError(
            err.message || "Error"),
        });
      });
};

/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
 async function getJournalByISSN(data) {
  const docCount = await Journal.countDocuments(
      {$or: [{issn_electronic: data}, {issn_print: data}]}).exec();
  let value = false;
  if (docCount != 0) value = true;
  return value;
}

/**
 * Checks a list of DOIs to see if missing from database 
 * @param listtoCheck List that needs to be checked
 * @returns List of strings that dont exist
 */
const generateMissingDOIList = async (listtoCheck: Array<string>): Promise<string[]> => {
  let doesntExist: Array<string> = []

  for (let i = 0; i <= listtoCheck.length-1; i++) {
    const docCount: number = await Article.countDocuments({ doi: listtoCheck[i] }).exec();
    if (docCount != 1) doesntExist.push(listtoCheck[i])
  }
  return doesntExist
}

// Create a job to check the integrity of an ISSN
exports.createISSNforDOI = async (req: express.Request, res: express.Response) => {

  //check to see if the requested journal is truthy
  const {error} = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await getJournalByISSN(req.body.issn);
  if (!checkJournalExistsMongoDB) {
    return res.status(400)
        .send("The journal does not exist in the database");
  };

  // Add job from here
  const jobData = {
    issn: req.body.issn
  };
  addIntegrity(jobData)
  res.status(200).send({message: "Integrity checks now are being performed on this issn and should be available shortly"})
};

// Find a single Integrities with an id
exports.findOne = (req, res) => {
 // check to see if has ISSN format OR mongoDBID format
     Integrity.findById(req.params.id)
         .then((data) => {
           if (!data) {
             res.status(404).send(
                 {message: 'Not found Integrity check with id ' + req.params.id});
           } else res.send(serializer.serialize('integrity', data));
         })
         .catch((err) => {
           res.status(500).send(
               {message: 'Error retrieving Integrity check with id=' + req.params.id});
         });

};

// Find all integrity checks via ISSN 
exports.findAllViaISSN = async (req, res) => {

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await getJournalByISSN(req.params.id);
  if (!checkJournalExistsMongoDB) {
    return res.status(400)
        .send("The Journal does not exist in the database");
  };


 Integrity.find({"data.issn": req.params.id})
 .then((data) => {
  if (data.length == 0) {
    res.status(404).send(
        {message: 'Not found Integrity checks found for issn:  ' + req.params.id + ' [Maybe start one?]'});
  } else {
    res.send(serializer.serialize('integrity', data));
  }
})
.catch((err: Error) => {
  res
      .status(500)
      .send({message: 'Error retrieving Journal with id=' + req.parms.id});
});
};


// Delete all Integrities from the database.
exports.deleteAll = (req, res) => {
  Integrity.deleteMany({})
  .then((data) => {
    res.send({
      message: `${data.deletedCount} Integrity checks were deleted successfully!`,
    });
  })
  .catch((err) => {
    res.status(500).send({
      message:
      err.message || 'Some error occurred while removing all Integrity checks.',
    });
  });
};
