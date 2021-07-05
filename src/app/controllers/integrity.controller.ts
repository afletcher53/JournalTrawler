import express from 'express';
import db from '../models';
import { addIntegrity } from '../queues/integrity.queue';
import {
  mongoCheckJournalExistsByISSN,
  mongoFetchAllJournals
} from '../requests/mongoose.service';
import { journalPostValidation } from '../validation/journal.validation';
import serializer from '../validation/json.validation';
import HttpStatusCode from '../Typescript/Enums/HttpStatusCode.enum';
import StringLiterals from '../Typescript/Enums/StringLiterals.enum';
import jobLiterals from '../Typescript/Enums/JobCode.enum';

const Integrity = db.integrity;

// returns all integrities
const findAll = async (req: express.Request, res: express.Response) => {
  Integrity.find()
    .populate('journal')
    .then((data) => {
      res.send(serializer.serialize('integrity', data));
    })
    .catch((err) => {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: serializer.serializeError(
          err.message || StringLiterals.GENERIC_ERROR
        )
      });
    });
};

// Create a job to check missing DOIS of an ISSN
const createISSNforDOI = async (
  req: express.Request,
  res: express.Response
) => {
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
  //check to see if the requested journal is truthy
  const { error } = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(errorJournalValidation));
  }

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(
    req.body.issn
  );
  if (!checkJournalExistsMongoDB) {
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(StringLiterals.JOURNAL_NOT_EXIST);
  }

  // Add job from here
  const jobData = {
    issn: req.body.issn,
    code: jobLiterals.MISSING_DOIS
  };
  addIntegrity(jobData);
  res
    .status(HttpStatusCode.OK)
    .send({ message: StringLiterals.INTEGRITIES_START });
};

// Create a job to check the data completeness of an ISSN
const createISSNforMissing = async (
  req: express.Request,
  res: express.Response
) => {
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
  //check to see if the requested journal is truthy
  const { error } = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(errorJournalValidation));
  }

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(
    req.body.issn
  );
  if (!checkJournalExistsMongoDB) {
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(StringLiterals.JOURNAL_NOT_EXIST);
  }

  // Add job from here
  const jobData = {
    issn: req.body.issn,
    code: jobLiterals.DATA_COMPLETENESS_SINGLE
  };
  addIntegrity(jobData);
  res
    .status(HttpStatusCode.OK)
    .send({ message: StringLiterals.INTEGRITIES_START });
};

const updateISSN = async (req: express.Request, res: express.Response) => {
  if (req.body.issn === undefined) {
    return res
      .status(HttpStatusCode.CONFLICT)

      .send(
        serializer.serializeError(new Error(StringLiterals.ISSN_NOT_SUPPLIED))
      );
  }
  req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');

  //check to see if the requested journal is truthy
  const { error } = journalPostValidation(req.body);
  if (error) {
    const errorJournalValidation = new Error(error.details[0].message);
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(serializer.serializeError(errorJournalValidation));
  }

  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(
    req.body.issn
  );
  if (!checkJournalExistsMongoDB) {
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(StringLiterals.JOURNAL_NOT_EXIST);
  }

  // Add job from here
  const jobData = {
    issn: req.body.issn,
    code: jobLiterals.UPDATE_ISSN_SINGLE
  };
  addIntegrity(jobData);
  res
    .status(HttpStatusCode.OK)
    .send({ message: StringLiterals.INTEGRITIES_START });
};

// Find a single Integrities with an id
const findOne = (req, res) => {
  // check to see if has ISSN format OR mongoDBID format
  Integrity.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .send({ message: StringLiterals.INTEGRITY_NOT_FOUND });
      } else {
        res.send(serializer.serialize('integrity', data));
      }
    })
    .catch((err) => {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: StringLiterals.INTEGRITY_ERROR_FIND });
    });
};

// Find all integrity checks via ISSN
const findAllViaISSN = async (req, res) => {
  //check to see if the journal exists on the database
  const checkJournalExistsMongoDB = await mongoCheckJournalExistsByISSN(
    req.params.id
  );
  if (!checkJournalExistsMongoDB) {
    return res
      .status(HttpStatusCode.CONFLICT)
      .send(StringLiterals.JOURNAL_NOT_EXIST);
  }

  Integrity.find({ 'data.issn': req.params.id })
    .then((data) => {
      if (data.length === 0) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .send({ message: StringLiterals.INTEGRITY_NOT_FOUND });
      } else {
        res.send(serializer.serialize('integrity', data));
      }
    })
    .catch((err: Error) => {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send({ message: 'Error retrieving Journal with id=' + req.parms.id });
    });
};

// Delete all Integrities from the database.
const deleteAll = (req, res) => {
  Integrity.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Integrity checks were deleted successfully!`
      });
    })
    .catch((err) => {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({
        message: err.message || StringLiterals.GENERIC_ERROR
      });
    });
};

const updateAllISSN = async (req, res) => {
  // get all Journals from the databvase.
  const allJournals = await mongoFetchAllJournals();
  allJournals.forEach((element) => {
    //get an ISSN to check!
    let resolvedIssn = null;
    if (element.issn_electronic != null) {
      resolvedIssn = element.issn_electronic;
    } else {
      resolvedIssn = element.issn_print;
    }
    const jobData = {
      issn: resolvedIssn,
      code: jobLiterals.MISSING_DOIS
    };
    addIntegrity(jobData);
    res
      .status(HttpStatusCode.OK)
      .send({ message: StringLiterals.INTEGRITIES_START });
  });
};

const createISSNforAllMissing = async (req, res) => {
  // get all Journals from the databvase.
  const allJournals = await mongoFetchAllJournals();
  allJournals.forEach((element: { issn_electronic: any; issn_print: any }) => {
    //get an ISSN to check!
    let resolvedIssn = null;
    if (element.issn_electronic != null) {
      resolvedIssn = element.issn_electronic;
    } else {
      resolvedIssn = element.issn_print;
    }
    const jobData = {
      issn: resolvedIssn,
      code: 2
    };
    addIntegrity(jobData);
    res
      .status(HttpStatusCode.OK)
      .send({ message: StringLiterals.INTEGRITIES_START });
  });
};

export default {
  findAll,
  createISSNforDOI,
  createISSNforAllMissing,
  createISSNforMissing,
  updateISSN,
  findOne,
  findAllViaISSN,
  deleteAll,
  updateAllISSN
};
