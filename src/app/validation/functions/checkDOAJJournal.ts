import { fetchArticleExistsByISSNDOAJ } from '../../requests/doaj.service';

const checkDOAJJournalExistsDOAJ = async (issn: string): Promise<boolean> => {
    const data = await fetchArticleExistsByISSNDOAJ(issn);
    if (data.results[0] !== undefined && 'bibjson' in data.results[0]){
      return true;
   } else {
     return false;
   }
  };

export default checkDOAJJournalExistsDOAJ;
