import checkCrossrefJournalExists from '../../app/validation/functions/checkCrossrefJournalExists';


describe('Checks to see if known crossref issns return true or false', () => {
    test('it should return true', async() => {
       const veterinaryEvidenceIssn = '2396-9776';
       const data = await checkCrossrefJournalExists(veterinaryEvidenceIssn);
       expect(data).toEqual(true);
      });
    test('it should return false', async() => {
       const madeUpIssn = '1234-1234';
       const data = await checkCrossrefJournalExists(madeUpIssn);
       expect(data).toEqual(false);
      });
});
