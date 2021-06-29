import { fetchArticleByDOI } from '../../app/requests/crossref.service';
import TestLiterals from '../../app/Typescript/Enums/TestLiterals.enum';


describe('Checks to see if Crossref Services are responding correctly', () => {
    test('it should return true', async() => {
       const data = await fetchArticleByDOI(TestLiterals.DOI_EXISTS_CROSSREF);
       expect(data.status).toBe('ok');
      });
});
