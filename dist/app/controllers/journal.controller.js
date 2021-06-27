"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const journal_queue_1 = require("../queues/journal.queue");
const mongoose_service_1 = require("../requests/mongoose.service");
const getJournalData_1 = __importDefault(require("../validation/functions/getJournalData"));
const checkCrossrefJournalExists_1 = __importDefault(require("../validation/functions/checkCrossrefJournalExists"));
const error_validation_1 = require("../validation/error.validation");
const journal_validation_1 = require("../validation/journal.validation");
const json_validation_1 = __importDefault(require("../validation/json.validation"));
const HttpStatusCode_enum_1 = __importDefault(require("../static/HttpStatusCode.enum"));
const StringLiterals_enum_1 = __importDefault(require("../static/StringLiterals.enum"));
const mongoDB_logger_1 = __importDefault(require("../loggers/mongoDB.logger"));
// Create and Save a new Journal
const create = async (req, res) => {
    if (req.body.issn) {
        req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    }
    //  Validate request
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res.status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    //  Check to see if already exists in MongooseDB
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (checkJournalExistsMongoDB) {
        return res.status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(error_validation_1.createErrorExists(req.body.issn, 'Journal'));
    }
    // Check to see if ISSN exists on crossref
    const checkCrossRefExists = await checkCrossrefJournalExists_1.default(req.body.issn);
    if (!checkCrossRefExists) {
        return res.status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(error_validation_1.createErrorExistsCrossRef(req.body.issn, 'Journal'));
    }
    // Get the data from crossref
    const journalData = await getJournalData_1.default(req.body.issn);
    // save the journal
    mongoose_service_1.mongoSaveJournal(journalData)
        .then((data) => {
        const journalISSN = {
            journal_id: data._id,
            issn: req.body.issn,
        };
        journal_queue_1.addJournal(journalISSN);
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || StringLiterals_enum_1.default.GENERIC_ERROR,
        });
    });
};
// Retrieve all Journals from the database.
const findAll = async (req, res) => {
    const title = req.query.title;
    const condition = title ? { title: { $regex: new RegExp(title), $options: 'i' } } : {};
    mongoose_service_1.mongoFindJournalWhere(condition)
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || StringLiterals_enum_1.default.GENERIC_ERROR,
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
            await mongoose_service_1.mongofetchJournalByISSN(issn).then((data) => {
                if (!data) {
                    res.status(HttpStatusCode_enum_1.default.NOT_FOUND).send({ message: 'Not found Journal with id ' + req.params.id });
                }
                else {
                    res.send(json_validation_1.default.serialize('journal', data));
                }
            })
                .catch((err) => {
                res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({ message: 'Error retrieving Journal with id=' + req.params.id });
            });
        }
        catch (e) {
            res.status(HttpStatusCode_enum_1.default.CONFLICT).send({
                message: StringLiterals_enum_1.default.GENERIC_ERROR,
            });
        }
    }
    else {
        const { error } = journal_validation_1.journalSingleValidation(req.params);
        if (error) {
            return res.status(HttpStatusCode_enum_1.default.CONFLICT).send(error.details[0].message);
        }
        try {
            mongoose_service_1.mongoFindJournalById(req)
                .then((data) => {
                if (!data) {
                    res.status(HttpStatusCode_enum_1.default.NOT_FOUND).send({ message: 'Not found Journal with id ' + req.params.id });
                }
                else {
                    res.send(json_validation_1.default.serialize('journal', data));
                }
            })
                .catch((err) => {
                res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({ message: 'Error retrieving Journal with id=' + req.params.id });
            });
        }
        catch (e) {
            res.status(HttpStatusCode_enum_1.default.CONFLICT).send({
                message: e.message || StringLiterals_enum_1.default.GENERIC_ERROR,
            });
        }
    }
};
// Update a Journal by the id in the request
const update = (req, res) => {
    if (!req.body) {
        return res.status(HttpStatusCode_enum_1.default.CONFLICT).send({
            message: 'Data to update can not be empty!',
        });
    }
    const id = req.params.id;
    mongoose_service_1.mongoFindJournalByIdAndUpdate(id, req)
        .then((data) => {
        if (!data) {
            res.status(HttpStatusCode_enum_1.default.NOT_FOUND).send({
                message: `Cannot update Journal with id=${id}.
             Maybe Journal was not found!`,
            });
        }
        else {
            res.send({ message: 'Journal was updated successfully.' });
        }
    })
        .catch((err) => {
        mongoDB_logger_1.default.error(err);
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: 'Error updating Journal with id=' + id,
        });
    });
};
// Delete a Journal with the specified id in the request
const deleteOne = (req, res) => {
    const { error } = journal_validation_1.journalSingleValidation(req.params);
    if (error) {
        return res.status(HttpStatusCode_enum_1.default.CONFLICT).send(error.details[0].message);
    }
    try {
        mongoose_service_1.mongoFindJournalByIdAndRemove(req)
            .then((data) => {
            if (!data) {
                res.status(HttpStatusCode_enum_1.default.NOT_FOUND).send({
                    message: `Cannot delete Journal with id=${req.params.id}.
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
            mongoDB_logger_1.default.error(err);
            res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
                message: 'Could not delete Journal with id=' + req.parms.id,
            });
        });
    }
    catch (e) {
        res.status(HttpStatusCode_enum_1.default.CONFLICT).send(e);
    }
};
// Delete all Journals from the database.
const deleteAll = (req, res) => {
    mongoose_service_1.mongoDeleteAllJournals()
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Journals were deleted successfully!`,
        });
    })
        .catch((err) => {
        mongoDB_logger_1.default.error(err);
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || 'Some error occurred while removing all Journals.',
        });
    });
};
// Find all published Journals
const findAllPublished = (req, res) => {
    mongoose_service_1.mongoFindJournalWhere({ published: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        mongoDB_logger_1.default.error(err);
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || StringLiterals_enum_1.default.GENERIC_ERROR,
        });
    });
};
// Find all Crossreff Synced Journals
const findAllCRScraped = (req, res) => {
    mongoose_service_1.mongoFindJournalWhere({ cr_parsed: true })
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        mongoDB_logger_1.default.error(err);
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || StringLiterals_enum_1.default.GENERIC_ERROR,
        });
    });
};
// Find all Crossreff Synced Journals
const findAllCRUnscraped = (req, res) => {
    mongoose_service_1.mongoFindJournalWhere({ cr_parsed: false })
        .then((data) => {
        res.send(json_validation_1.default.serialize('journal', data));
    })
        .catch((err) => {
        mongoDB_logger_1.default.error(err);
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || StringLiterals_enum_1.default.GENERIC_ERROR,
        });
    });
};
exports.default = {
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
