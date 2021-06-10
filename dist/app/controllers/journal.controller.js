"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Journal = void 0;
const models_1 = __importDefault(require("../models"));
exports.Journal = models_1.default.journals;
const journal_validation_1 = require("../validation/journal.validation");
const json_validation_1 = __importDefault(require("../validation/json.validation"));
const crossref_validation_1 = require("../validation/crossref.validation");
const error_validation_1 = require("../validation/error.validation");
const internal_functions_requests_1 = __importDefault(require("../requests/internal.functions.requests"));
const journal_queue_1 = require("../queues/journal.queue");
const findJournal_1 = require("./functions/findJournal");
const { getJournalByISSN } = require('./functions/getJournalByISSN');
// Create and Save a new Journal
exports.create = async (req, res) => {
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    // Validate request
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res.status(400)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    ;
    // check to see if already exists in MongooseDB
    const checkJournalExistsMongoDB = await getJournalByISSN(req.body.issn);
    if (checkJournalExistsMongoDB) {
        return res.status(400)
            .send(error_validation_1.createErrorExists(req.body.issn, 'Journal'));
    }
    ;
    // check to see if ISSN exists on crossref
    const checkCrossRefExists = await crossref_validation_1.checkExists(req.body.issn);
    if (!checkCrossRefExists) {
        return res.status(400)
            .send(error_validation_1.createErrorExistsCrossRef(req.body.issn, 'Journal'));
    }
    // get the data from crossref
    const journalData = await crossref_validation_1.getJournalData(req.body.issn);
    // save the journal
    try {
        const journal = new exports.Journal(journalData);
        journal
            .save(journal.data)
            .then((data) => {
            const journalISSN = {
                issn: req.body.issn,
            };
            journal_queue_1.addJournal(journalISSN);
            res.send(json_validation_1.default.serialize('journal', data));
        })
            .catch((err) => {
            res.status(500).send({
                message: err.message || error_validation_1.createErrorGeneric,
            });
        });
        // spawn a job that will parse the article for DOIs.
    }
    catch (err) {
        res.status(400).send({
            message: err.message || error_validation_1.createErrorGeneric(),
        });
    }
};
// Retrieve all Journals from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    const condition = title ?
        { title: { $regex: new RegExp(title), $options: 'i' } } : {};
    exports.Journal.find(condition)
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || error_validation_1.createErrorGeneric(),
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
            findJournal_1.findJournal(issn, res);
        }
        catch (e) {
            res.status(400).send({
                message: error_validation_1.createErrorGeneric(),
            });
        }
    }
    else {
        // MongoDB format
        const { error } = journal_validation_1.journalSingleValidation(req.params);
        // const isISSN = /\b\d{3}[0-9]-\d{3}[0-9]\b/.test(req.params.id);
        if (error)
            return res.status(400).send(error.details[0].message);
        try {
            exports.Journal.findById(req.params.id)
                .then((data) => {
                if (!data) {
                    res.status(404).send({ message: 'Not found Journal with id ' + req.params.id });
                }
                else
                    res.send(json_validation_1.default.serialize('journal', data));
            })
                .catch((err) => {
                res.status(500).send({ message: 'Error retrieving Journal with id=' + req.params.id });
            });
        }
        catch (e) {
            res.status(400).send({
                message: err.message || error_validation_1.createErrorGeneric(),
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
    exports.Journal.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
        if (!data) {
            res.status(404).send({
                message: `Cannot update Journal with id=${id}.
             Maybe Journal was not found!`,
            });
        }
        else
            res.send({ message: 'Journal was updated successfully.' });
    })
        .catch((err) => {
        res.status(500).send({
            message: 'Error updating Journal with id=' + id,
        });
    });
};
// Delete a Journal with the specified id in the request
exports.delete = (req, res) => {
    const { error } = journal_validation_1.journalSingleValidation(req.params);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        exports.Journal.findByIdAndRemove(id, { useFindAndModify: false })
            .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Journal with id=${id}.
               Maybe Journal was not found!`,
                });
            }
            else {
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
    }
    catch {
        res.status(400).send(e);
    }
};
// Delete all Journals from the database.
exports.deleteAll = (req, res) => {
    exports.Journal.deleteMany({})
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Journals were deleted successfully!`,
        });
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while removing all Journals.',
        });
    });
};
// Find all published Journals
exports.findAllPublished = (req, res) => {
    exports.Journal.find({ published: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving Journals.',
        });
    });
};
// Find all Crossreff Synced Journals
exports.findAllCRScraped = (req, res) => {
    exports.Journal.find({ cr_parsed: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving Journals.',
        });
    });
};
// Find all Crossreff Synced Journals
exports.findAllCRUnscraped = (req, res) => {
    exports.Journal.find({ cr_parsed: false })
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving Journals.',
        });
    });
};
exports.bulkAdd = async (req, res) => {
    const { error } = journal_validation_1.journalMultipleValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    req.body.issns.forEach((e) => {
        internal_functions_requests_1.default(e);
    });
    res.status(200).send({
        message: 
        // eslint-disable-next-line max-len
        'These journals have been added, you cannot see the status of these journals',
    });
};
