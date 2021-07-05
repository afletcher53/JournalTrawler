import getDate from './getDate';
import db from '../../models';
import mongoose from 'mongoose';
const Article = db.articles;
const toId = mongoose.Types.ObjectId;

const setArticleDetails = (
  doi: string,
  printISSN: any,
  electronicISSN: any,
  articleData: any,
  journalId: string
) => {
  const data = articleData.message;
  let license: string;
  if (articleData.message.hasOwnProperty('license')) {
    license = articleData.message.license[0]['URL'];
  }
  const { publishedPrintDate, publishedOnlineDate } = getDate(articleData);

  return new Article({
    crossref_url: encodeURI('https://api.crossref.org/works/' + doi),
    journal_issn_electronic: electronicISSN ? electronicISSN : null,
    journal_issn_print: printISSN ? printISSN : null,
    publisher: data.hasOwnProperty('publisher') ? data.publisher : 0,
    reference_count: data['reference-count'] ? data['reference-count'] : 0,
    is_referenced_by_count: data['is-referenced-by-count']
      ? data['is-referenced-by-count']
      : 0,
    published_online: publishedOnlineDate ? publishedOnlineDate : null,
    published_print: publishedPrintDate ? publishedPrintDate : null,
    type: data.type ? data.type : null,
    abstract: data.abstract ? data.abstract : null,
    title: data.title ? String(data.title) : null,
    url: data['URL'] ? data['URL'] : null,
    doi: data['DOI'] ? data['DOI'] : null,
    license: license ? license : null,
    cr_parsed: false,
    journal: toId(journalId)
  });
};

export default setArticleDetails;
