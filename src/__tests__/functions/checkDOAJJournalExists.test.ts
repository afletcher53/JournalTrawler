import TestLiterals from '../../app/Typescript/Enums/TestLiterals.enum';
import checkDOAJJournalExists from '../../app/validation/functions/checkDOAJJournalExists';


describe('Checks to see if known crossref issns return true or false', () => {
    test('it should return true', async() => {
       const data = await checkDOAJJournalExists(TestLiterals.ISSN_EXISTS_CROSSREF);
       expect(data).toEqual(true);
      });
    test('it should return false', async() => {
       const data = await checkDOAJJournalExists(TestLiterals.ISSN_DOESNT_EXIST);
       expect(data).toEqual(false);
      });
});
