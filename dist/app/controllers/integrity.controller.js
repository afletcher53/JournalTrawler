"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const integrity_queue_1 = require("../queues/integrity.queue");
const mongoose_service_1 = require("../requests/mongoose.service");
const journal_validation_1 = require("../validation/journal.validation");
const json_validation_1 = __importDefault(require("../validation/json.validation"));
const Integrity = models_1.default.integrity;
// returns all integrities 
exports.findAll = async (req, res) => {
    Integrity.find()
        .populate('journal')
        .then((data) => {
        res.send(json_validation_1.default.serialize('integrity', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: json_validation_1.default.serializeError(err.message || "Error"),
        });
    });
};
// Create a job to check missing DOIS of an ISSN
exports.createISSNforDOI = async (req, res) => {
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    //check to see if the requested journal is truthy
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res.status(400)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    //check to see if the journal exists on the database
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
        return res.status(400)
            .send("The journal does not exist in the database");
    }
    // Add job from here
    const jobData = {
        issn: req.body.issn,
        code: 1
    };
    integrity_queue_1.addIntegrity(jobData);
    res.status(200).send({ message: "Integrity checks now are being performed on this issn and should be available shortly" });
};
// Create a job to check the data completeness of an ISSN
exports.createISSNforMissing = async (req, res) => {
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    //check to see if the requested journal is truthy
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res.status(400)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    //check to see if the journal exists on the database
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
        return res.status(400)
            .send("The journal does not exist in the database");
    }
    // Add job from here
    const jobData = {
        issn: req.body.issn,
        code: 2
    };
    integrity_queue_1.addIntegrity(jobData);
    res.status(200).send({ message: "Integrity checks now are being performed on this issn and should be available shortly" });
};
exports.updateISSN = async (req, res) => {
    if (req.body.issn == undefined) {
        return res.status(400)
            .send(json_validation_1.default.serializeError(new Error('No issn supplied in body')));
    }
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    //check to see if the requested journal is truthy
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res.status(400)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    ;
    //check to see if the journal exists on the database
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
        return res.status(400)
            .send("The journal does not exist in the database");
    }
    ;
    // Add job from here
    const jobData = {
        issn: req.body.issn,
        code: 3
    };
    integrity_queue_1.addIntegrity(jobData);
    res.status(200).send({ message: "Integrity checks now are being performed on this issn and should be available shortly" });
};
// Find a single Integrities with an id
exports.findOne = (req, res) => {
    // check to see if has ISSN format OR mongoDBID format
    Integrity.findById(req.params.id)
        .then((data) => {
        if (!data) {
            res.status(404).send({ message: 'Not found Integrity check with this id' });
        }
        else
            res.send(json_validation_1.default.serialize('integrity', data));
    })
        .catch((err) => {
        res.status(500).send({ message: 'Error retrieving Integrity check with this id' });
    });
};
// Find all integrity checks via ISSN 
exports.findAllViaISSN = async (req, res) => {
    //check to see if the journal exists on the database
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.params.id);
    if (!checkJournalExistsMongoDB) {
        return res.status(400)
            .send("The Journal does not exist in the database");
    }
    ;
    Integrity.find({ "data.issn": req.params.id })
        .then((data) => {
        if (data.length == 0) {
            res.status(404).send({ message: 'Not found Integrity checks found for issn [Maybe start one?]' });
        }
        else {
            res.send(json_validation_1.default.serialize('integrity', data));
        }
    })
        .catch((err) => {
        res
            .status(500)
            .send({ message: 'Error retrieving Journal with id=' + req.parms.id });
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
            message: err.message || 'Some error occurred while removing all Integrity checks.',
        });
    });
};
exports.updateAllISSN = async (req, res) => {
    // get all Journals from the databvase.
    const allJournals = await mongoose_service_1.mongoFetchAllJournals();
    allJournals.forEach(element => {
        //get an ISSN to check!
        let issn = null;
        if (element.issn_electronic != null) {
            issn = element.issn_electronic;
        }
        else {
            issn = element.issn_print;
        }
        const jobData = {
            issn: issn,
            code: 1
        };
        integrity_queue_1.addIntegrity(jobData);
        res.status(200).send({ message: "Integrity checks now are being performed on this issn and should be available shortly" });
    });
};
exports.createISSNforAllMissing = async (req, res) => {
    // get all Journals from the databvase.
    const allJournals = await mongoose_service_1.mongoFetchAllJournals();
    allJournals.forEach((element) => {
        //get an ISSN to check!
        let issn = null;
        if (element.issn_electronic != null) {
            issn = element.issn_electronic;
        }
        else {
            issn = element.issn_print;
        }
        const jobData = {
            issn: issn,
            code: 2
        };
        integrity_queue_1.addIntegrity(jobData);
        res.status(200).send({ message: "Integrity checks now are being performed on this issn and should be available shortly" });
    });
};
