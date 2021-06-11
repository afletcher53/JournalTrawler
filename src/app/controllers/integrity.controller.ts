import express from 'express';
import db from '../models';
import { addIntegrity } from '../queues/integrity.queue';
import { mongoCheckJournalExistsByISSN } from '../requests/mongoose.service';
import { journalPostValidation } from '../validation/journal.validation';
import serializer from '../validation/json.validation';

const Integrity = db.integrity;

// returns all integrities 
exports.findAll = async (req: express.Request, res: express.Response) => {
  Integrity.find()
  .populate('journal')
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


// Create a job to check missing DOIS of an ISSN
exports.createISSNforDOI = async (req: express.Request, res: express.Response) => {
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
  //check to see if the requested journal is truthy
  const {error} = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(req.body.issn);
  if (!checkJournalExistsMongoDB) {
    return res.status(400)
        .send("The journal does not exist in the database");
  };

  // Add job from here
  const jobData = {
    issn: req.body.issn,
    code: 1
  };
  addIntegrity(jobData)
  res.status(200).send({message: "Integrity checks now are being performed on this issn and should be available shortly"})
};

// Create a job to check the data completeness of an ISSN
exports.createISSNforMissing = async (req: express.Request, res: express.Response) => {
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
  //check to see if the requested journal is truthy
  const {error} = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(req.body.issn);
  if (!checkJournalExistsMongoDB) {
    return res.status(400)
        .send("The journal does not exist in the database");
  };

  // Add job from here
  const jobData = {
    issn: req.body.issn,
    code: 2
  };
  addIntegrity(jobData)
  res.status(200).send({message: "Integrity checks now are being performed on this issn and should be available shortly"})
};

exports.updateISSN = async (req: express.Request, res: express.Response) => {

  if(req.body.issn == undefined) {
    return res.status(400)
 
    .send(serializer.serializeError(new Error ('No issn supplied in body')));
  }
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');

  //check to see if the requested journal is truthy
  const {error} = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res.status(400)
        .send(serializer.serializeError(errorJournalValidation));
  };

    //check to see if the journal exists on the database
    const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
      return res.status(400)
          .send("The journal does not exist in the database");
    };

  // Add job from here
  const jobData = {
    issn: req.body.issn,
    code: 3
  };
  addIntegrity(jobData)
  res.status(200).send({message: "Integrity checks now are being performed on this issn and should be available shortly"})
}

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
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(req.params.id);
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
