"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestLiterals_enum_1 = __importDefault(require("../../app/Typescript/Enums/TestLiterals.enum"));
const getJournalData_1 = __importDefault(require("../../app/validation/functions/getJournalData"));
describe('Get Journal', () => {
    test('it should return a Journal Object with known data', async () => {
        const input = TestLiterals_enum_1.default.ISSN_EXISTS_CROSSREF;
        const data = await getJournalData_1.default(input);
        expect(data.title).toBe(TestLiterals_enum_1.default.ISSN_EXISTS_CROSSREF_TITLE);
    });
});
