"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJournalData = exports.articleSingleValidation = exports.articleCrossRefResponseValidation = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
const models_1 = __importDefault(require("../models"));
const crossref_service_1 = require("../requests/crossref.service");
const Journal = models_1.default.journals;
const options = {
    abortEarly: false,
    allowUnknown: true,
    errors: {
        wrap: {
            label: '',
        },
    },
};
// Article Post Validation
const articleCrossRefResponseValidation = (data) => {
    const schema = joi_1.default.object({
        message: joi_1.default.object().keys({
            title: joi_1.default.required(),
            DOI: joi_1.default.required(),
            abstract: joi_1.default.string(),
            publisher: joi_1.default.required(),
            'reference-count': joi_1.default.required(),
            'is-referenced-by-count': joi_1.default.required(),
            type: joi_1.default.required(),
            URL: joi_1.default.required()
        })
    });
    return schema.validate(data, options);
};
exports.articleCrossRefResponseValidation = articleCrossRefResponseValidation;
const articleSingleValidation = (data) => {
    const schema = joi_1.default.object({
        id: joi_1.default
            .string()
            .required()
            .min(6),
    });
    return schema.validate(data, options);
};
exports.articleSingleValidation = articleSingleValidation;
const getJournalData = async (issn) => {
    const data = await crossref_service_1.fetchJournalByISSN(issn);
    let issnElectronic;
    let issnPrint;
    let crDate;
    // const absSrcDoaj: Boolean = await checkDOAJJournalExistsDOAJ(issn)
    // lets extract the electronic and print journal and assign to variables
    const issns = data.data.message['issn-type'];
    if (Object.keys(issns).length > 0) {
        issns.forEach((element) => {
            if (element.type === 'electronic') {
                issnElectronic = element.value;
            }
            if (element.type === 'print') {
                issnPrint = element.value;
            }
        });
    }
    ;
    // if not documented, assign the issn to issnPrint
    if (issnElectronic == undefined && issnPrint == undefined) {
        issnPrint = decodeURI(issn);
    }
    if (data.data.message['last-status-check-time'])
        crDate = new Date(data.data.message['last-status-check-time']);
    // lets format a Journal object to return here.
    const journal = new Journal({
        title: data.data.message.title ? data.data.message.title : null,
        publisher: data.data.message.publisher ? data.data.message.publisher : null,
        counts_totaldois: data.data.message.counts['total-dois'] ? data.data.message.counts['total-dois'] : null,
        counts_currentdois: data.data.message.counts['current-dois'] ? data.data.message.counts['current-dois'] : null,
        counts_backfiledois: data.data.message.counts['backfile-dois'] ? data.data.message.counts['backfile-dois'] : null,
        cr_parsed: false,
        cr_last_status_check_time: crDate ? crDate : null,
        issn_print: issnPrint ? issnPrint : null,
        issn_electronic: issnElectronic ? issnElectronic : null,
        // abstract_source_doaj: absSrcDoaj ? absSrcDoaj : null
    });
    return journal;
};
exports.getJournalData = getJournalData;
