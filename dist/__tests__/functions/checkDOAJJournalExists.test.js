"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestLiterals_enum_1 = __importDefault(require("../../app/Typescript/Enums/TestLiterals.enum"));
const checkDOAJJournalExists_1 = __importDefault(require("../../app/validation/functions/checkDOAJJournalExists"));
describe('Checks to see if known crossref issns return true or false', () => {
    test('it should return true', async () => {
        const data = await checkDOAJJournalExists_1.default(TestLiterals_enum_1.default.ISSN_EXISTS_CROSSREF);
        expect(data).toEqual(true);
    });
    test('it should return false', async () => {
        const data = await checkDOAJJournalExists_1.default(TestLiterals_enum_1.default.ISSN_DOESNT_EXIST);
        expect(data).toEqual(false);
    });
});
