
import TestLiterals from '../../app/Typescript/Enums/TestLiterals.enum';
import getJournalData from '../../app/validation/functions/getJournalData';

describe('Get Journal', () => {
    test('it should return a Journal Object with known data', async () => {
       const input: string = TestLiterals.ISSN_EXISTS_CROSSREF;
       const data: Journal = await getJournalData(input);
       expect(data.title).toBe(TestLiterals.ISSN_EXISTS_CROSSREF_TITLE);
      });
});
