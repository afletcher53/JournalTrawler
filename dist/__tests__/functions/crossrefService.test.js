"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crossref_service_1 = require("../../app/requests/crossref.service");
const TestLiterals_enum_1 = __importDefault(require("../../app/Typescript/Enums/TestLiterals.enum"));
describe('Checks to see if Crossref Services are responding correctly', () => {
    test('it should return true', async () => {
        const data = await crossref_service_1.fetchArticleByDOI(TestLiterals_enum_1.default.DOI_EXISTS_CROSSREF);
        expect(data.status).toBe('ok');
    });
});
