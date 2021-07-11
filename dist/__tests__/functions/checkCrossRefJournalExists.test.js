"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkCrossrefJournalExists_1 = __importDefault(require("../../app/validation/functions/checkCrossrefJournalExists"));
describe('Checks to see if known crossref issns return true or false', () => {
    test('it should return true', async () => {
        const veterinaryEvidenceIssn = '2396-9776';
        const data = await checkCrossrefJournalExists_1.default(veterinaryEvidenceIssn);
        expect(data).toEqual(true);
    });
    test('it should return false', async () => {
        const madeUpIssn = '1234-1234';
        const data = await checkCrossrefJournalExists_1.default(madeUpIssn);
        expect(data).toEqual(false);
    });
});
