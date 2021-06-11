import { http } from "../vendors/axiosCrossref.vendors";

export type Article = {
  doi: String
};

export const fetchArticleByDOI = async (doi: String): Promise<Article[]> => {
  const { data } = await http.get<Article[]>("/works/" + doi);
  return data;
};

export const fetchJournalMetadataByISSN = async (issn: String): Promise<any> => {
  const data = await http.get("/journals/" + issn + '/works?cursor=*');
  return data;
};


export const fetchArticleHeadByDOI = async (doi: String): Promise<any> => {
  const  data  = await http.head("/works/" + doi);
  return data;
};

export const fetchJournalHeadByISSN = async (ISSN: String): Promise<any> => {
  const  data  = await http.head("/journals/" + ISSN);
  return data;
};

export const fetchJournalByISSN = async (issn: String): Promise<any> => {
  const data = await http.get('journals/' + issn)
  return data
}

export const fetchDOIsFromISSN = async (issn: String): Promise<Article[]> => {
  const data = await getDOIsfromISSNSample(issn, 5)
  // const data = await getDOIsfromISSN(issn)
  return data
};

/**
 * Search CrossRef API via ISSN to return list of DOIs from it.
 * @param {String} issn ISSN to be searched on the CrossRefAPI
 * @param {Number} rows The number of results to be returned (range: 10-1000?), default 1000
 * @param {String} cursor Starting point for API search, URI string (* for start search, given by API), default *
 * @param {List} data List of DOIS generated from API search
 * @returns {List} data List of DOIS from the CrossRefAPISearch 
 */
// const getDOIsfromISSN = async(issn: String, rows?: Number, cursor?: string, data: any = []) => {
//   if (cursor == undefined) cursor = '*'
//   if (rows == undefined) rows = 1000
//   cursor = cursor.toString()
//   let url = '/journals/' + issn + '/works?rows=' + rows + '&cursor=' + encodeURIComponent(cursor)
//   const response = await http.get(url);
//   if (response.data.message['next-cursor'] == cursor)
//       return data;
//   data.push(...response.data.message.items);
//   return getDOIsfromISSN(issn, rows, response.data.message['next-cursor'], data);
// }

/**
 * Search CrossRef API via ISSN to return sample of DOIs from it.
 * @param {String} issn ISSN to be searched on the CrossRefAPI
 * @param {List} data List of DOIS generated from API search
 * @returns {Array} data List of DOIS from the CrossRefAPISearch 
 */
const getDOIsfromISSNSample = async(issn: String, sampleSize: Number)=>  {
  let data = []
  let url = '/journals/' + issn + '/works?sample=' + sampleSize
  const response = await http.get(url);
  data.push(...response.data.message.items);
  return data;
}
