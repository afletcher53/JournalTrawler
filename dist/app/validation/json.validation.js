"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_api_serializer_1 = __importDefault(require("json-api-serializer"));
const Serializer = new json_api_serializer_1.default();
Serializer.register('article', {
    id: 'id',
    whitelist: ['doi', 'title', 'journal', 'abstract', 'license', 'journal'],
    links: {
        // An object or a function that describes links.
        self: function (data) {
            // Can be a function or a string value ex: { self: '/articles/1'}
            return '/api/articles/' + data.id;
        },
    },
    topLevelMeta: function (data, extraData) {
        // An object or a function that describes top level meta.
        return {
            count: extraData.count,
            total: data.length,
        };
    },
    topLevelLinks: {
        // An object or a function that describes top level links.
        self: '/api/articles',
    },
});
Serializer.register('integrity', {
    id: 'id',
    whitelist: ['data', 'issn', 'message', 'journal', 'createdAt', 'updatedAt'],
    links: {
        // An object or a function that describes links.
        self: function (data) {
            // Can be a function or a string value ex: { self: '/articles/1'}
            return '/api/integrities/' + data.id;
        },
    },
    topLevelMeta: function (data, extraData) {
        // An object or a function that describes top level meta.
        return {
            count: extraData.count,
            total: data.length,
        };
    },
    topLevelLinks: {
        // An object or a function that describes top level links.
        self: '/api/integrities',
    },
});
Serializer.register('journal', {
    id: 'id',
    whitelist: ['title', 'journal',
        'issn', 'issn_electronic', 'issn_print', 'publisher', 'subject',
        'asjc', 'counts_totaldois', 'counts_currentdois', 'counts_backfiledois',
        'createdAt', 'updatedAt', 'cr_parsed', 'articles', 'totalArticles'],
    links: {
        // An object or a function that describes links.
        self: function (data) {
            // Can be a function or a string value ex: { self: '/articles/1'}
            return '/api/journals/' + data.id;
        },
    },
    topLevelMeta: function (data, extraData) {
        // An object or a function that describes top level meta.
        return {
            count: extraData.count,
            total: data.length,
        };
    },
    topLevelLinks: {
        // An object or a function that describes top level links.
        self: '/api/journals',
    },
});
exports.default = Serializer;
module.exports = Serializer;
//# sourceMappingURL=json.validation.js.map