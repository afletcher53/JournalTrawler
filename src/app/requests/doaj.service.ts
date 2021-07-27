import http from '../vendors/DOAJ.api';

export const fetchArticleExistsByISSNDOAJ = async (
  issn: string
): Promise<any> => {
  const url = 'journals/issn:' + issn;
  const { data } = await http.get(url);
  return data;
};

export const fetchAbstractByDOIDOAJ = async (doi: string): Promise<any> => {
  const doiSearch = 'doi:' + encodeURIComponent(doi);
  const url = 'articles/' + doiSearch;
  const { data } = await http.get(url);

  if (typeof data.results[0] !== 'undefined') {
    return data.results[0].bibjson.abstract;
  } else {
    return null;
  }
};
