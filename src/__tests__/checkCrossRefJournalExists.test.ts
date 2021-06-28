import checkCrossrefJournalExists from "../app/validation/functions/checkCrossrefJournalExists";


describe('Convert Request Duration into Milliseconds', () => {
    test('it should return a number', async() => {
       const veterinaryEvidenceIssn = '2396-9776';
       const data = await checkCrossrefJournalExists(veterinaryEvidenceIssn);
       expect(data).toEqual(true);
      });
    test('it should return a number', async() => {
       const madeUpIssn = '1234-1234';
       const data = await checkCrossrefJournalExists(madeUpIssn);
       console.log(data)
       expect(data).toEqual(false);
      });
});
