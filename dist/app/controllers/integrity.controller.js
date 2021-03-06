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
const HttpStatusCode_enum_1 = __importDefault(require("../Typescript/Enums/HttpStatusCode.enum"));
const StringLiterals_enum_1 = __importDefault(require("../Typescript/Enums/StringLiterals.enum"));
const JobCode_enum_1 = __importDefault(require("../Typescript/Enums/JobCode.enum"));
const Integrity = models_1.default.integrity;
const findAll = async (req, res) => {
    Integrity.find()
        .populate('journal')
        .then((data) => {
        res.send(json_validation_1.default.serialize('integrity', data));
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: json_validation_1.default.serializeError(err.message || StringLiterals_enum_1.default.GENERIC_ERROR)
        });
    });
};
const createISSNforDOI = async (req, res) => {
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(StringLiterals_enum_1.default.JOURNAL_NOT_EXIST);
    }
    const jobData = {
        issn: req.body.issn,
        code: JobCode_enum_1.default.MISSING_DOIS
    };
    integrity_queue_1.addIntegrity(jobData);
    res
        .status(HttpStatusCode_enum_1.default.OK)
        .send({ message: StringLiterals_enum_1.default.INTEGRITIES_START });
};
const createISSNforMissing = async (req, res) => {
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(StringLiterals_enum_1.default.JOURNAL_NOT_EXIST);
    }
    const jobData = {
        issn: req.body.issn,
        code: JobCode_enum_1.default.DATA_COMPLETENESS_SINGLE
    };
    integrity_queue_1.addIntegrity(jobData);
    res
        .status(HttpStatusCode_enum_1.default.OK)
        .send({ message: StringLiterals_enum_1.default.INTEGRITIES_START });
};
const updateISSN = async (req, res) => {
    if (req.body.issn === undefined) {
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(new Error(StringLiterals_enum_1.default.ISSN_NOT_SUPPLIED)));
    }
    req.body.issn = req.body.issn.replace(/[\u200c\u200b]/g, '');
    const { error } = journal_validation_1.journalPostValidation(req.body);
    if (error) {
        const errorJournalValidation = new Error(error.details[0].message);
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(json_validation_1.default.serializeError(errorJournalValidation));
    }
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.body.issn);
    if (!checkJournalExistsMongoDB) {
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(StringLiterals_enum_1.default.JOURNAL_NOT_EXIST);
    }
    const jobData = {
        issn: req.body.issn,
        code: JobCode_enum_1.default.UPDATE_ISSN_SINGLE
    };
    integrity_queue_1.addIntegrity(jobData);
    res
        .status(HttpStatusCode_enum_1.default.OK)
        .send({ message: StringLiterals_enum_1.default.INTEGRITIES_START });
};
const findOne = (req, res) => {
    Integrity.findById(req.params.id)
        .then((data) => {
        if (!data) {
            res
                .status(HttpStatusCode_enum_1.default.NOT_FOUND)
                .send({ message: StringLiterals_enum_1.default.INTEGRITY_NOT_FOUND });
        }
        else {
            res.send(json_validation_1.default.serialize('integrity', data));
        }
    })
        .catch((err) => {
        res
            .status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR)
            .send({ message: StringLiterals_enum_1.default.INTEGRITY_ERROR_FIND });
    });
};
const findAllViaISSN = async (req, res) => {
    const checkJournalExistsMongoDB = await mongoose_service_1.mongoCheckJournalExistsByISSN(req.params.id);
    if (!checkJournalExistsMongoDB) {
        return res
            .status(HttpStatusCode_enum_1.default.CONFLICT)
            .send(StringLiterals_enum_1.default.JOURNAL_NOT_EXIST);
    }
    Integrity.find({ 'data.issn': req.params.id })
        .then((data) => {
        if (data.length === 0) {
            res
                .status(HttpStatusCode_enum_1.default.NOT_FOUND)
                .send({ message: StringLiterals_enum_1.default.INTEGRITY_NOT_FOUND });
        }
        else {
            res.send(json_validation_1.default.serialize('integrity', data));
        }
    })
        .catch((err) => {
        res
            .status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR)
            .send({ message: 'Error retrieving Journal with id=' + req.parms.id });
    });
};
const deleteAll = (req, res) => {
    Integrity.deleteMany({})
        .then((data) => {
        res.send({
            message: `${data.deletedCount} Integrity checks were deleted successfully!`
        });
    })
        .catch((err) => {
        res.status(HttpStatusCode_enum_1.default.INTERNAL_SERVER_ERROR).send({
            message: err.message || StringLiterals_enum_1.default.GENERIC_ERROR
        });
    });
};
const updateAllISSN = async (req, res) => {
    const allJournals = await mongoose_service_1.mongoFetchAllJournals();
    allJournals.forEach((element) => {
        let resolvedIssn = null;
        if (element.issn_electronic != null) {
            resolvedIssn = element.issn_electronic;
        }
        else {
            resolvedIssn = element.issn_print;
        }
        const jobData = {
            issn: resolvedIssn,
            code: JobCode_enum_1.default.MISSING_DOIS
        };
        integrity_queue_1.addIntegrity(jobData);
        res
            .status(HttpStatusCode_enum_1.default.OK)
            .send({ message: StringLiterals_enum_1.default.INTEGRITIES_START });
    });
};
const createISSNforAllMissing = async (req, res) => {
    const allJournals = await mongoose_service_1.mongoFetchAllJournals();
    allJournals.forEach((element) => {
        let resolvedIssn = null;
        if (element.issn_electronic != null) {
            resolvedIssn = element.issn_electronic;
        }
        else {
            resolvedIssn = element.issn_print;
        }
        const jobData = {
            issn: resolvedIssn,
            code: 2
        };
        integrity_queue_1.addIntegrity(jobData);
        res
            .status(HttpStatusCode_enum_1.default.OK)
            .send({ message: StringLiterals_enum_1.default.INTEGRITIES_START });
    });
};
exports.default = {
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
