
import { Job } from 'bull';
import mongoose from 'mongoose';
import doiLogger from '../loggers/doi.logger';
import db from '../models';
import { fetchArticleByDOI } from '../requests/crossref.service';
import { articleCrossRefResponseValidation } from '../validation/crossref.validation';

const toId = mongoose.Types.ObjectId
const Article = db.articles;

/**
 * Add Article Job to the redis queue
 * @param job from the queue calling it.
 */
const articleProcess = async (job:Job) => {
  await getArticleByDOI(job.data.doi);
  var articleData: any = await fetchArticleByDOI(job.data.doi)
 
  //Validate the data. 
  const {error} =  articleCrossRefResponseValidation(articleData);
  if (error) throw Error(error.details[0].message);

  //TODO: check to see that a journal exists in the mongodb (to prevent orphaned articles) TODO 


  //Generate the article Object.
  const article = setArticleDetails(job.data.doi, job.data.print_issn, job.data.electronic_issn, articleData, job.data.journal_id);
  article
      .save(article)
      .catch((err: Error) => {
        const logText = "["+job.data.doi+"] Error processing " + err
        doiLogger.error(logText)
      });

};

export default articleProcess;

const setArticleDetails = (doi: String, printISSN: any, electronicISSN: any, articleData: any, journal_id: string) => {
  let data = articleData.message;
  let license: String
  if(articleData.message.hasOwwnProperty('license')) license = articleData.message.license[0]['URL']
  var { publishedPrintDate, publishedOnlineDate } = getDate(articleData);

  return new Article({
    crossref_url: encodeURI('https://api.crossref.org/works/' + doi),
    journal_issn_electronic: electronicISSN ? electronicISSN : null,
    journal_issn_print: printISSN ? printISSN : null,
    publisher: data.hasOwnProperty('publisher') ? data.publisher : 0,
    reference_count: data['reference-count'] ? data['reference-count'] : 0,
    is_referenced_by_count: data['is-referenced-by-count'] ? data['is-referenced-by-count'] : 0,
    published_online: publishedOnlineDate ? publishedOnlineDate : null,
    published_print: publishedPrintDate ? publishedPrintDate : null,
    type: data.type ? data.type : null,
    abstract: data.abstract ? data.abstract : null, 
    title: data.title ? String(data.title) : null,
    url: data['URL'] ? data['URL'] : null,
    doi: data['DOI'] ? data['DOI'] : null,
    license: license ? license  : null,
    cr_parsed: false,
    journal: toId(journal_id)
  });
}

/**
 * Function to extract date from the axios response. 
 * @param articleData 
 * @returns Two strings
 */
const getDate = (articleData) => {
  if (typeof articleData.message['published-online'] !== 'undefined') {
    //Set day to one if not provided
    if (!articleData.message['published-online']['date-parts'][0][2]) {
      var daytum = 1;
    } else {
      daytum = articleData.message['published-online']['date-parts'][0][2];
    }
    var  publishedOnlineDate = new Date(Date.UTC(articleData.message['published-online']['date-parts'][0][0], (articleData.message['published-online']['date-parts'][0][1] - 1), daytum));
  }

  if (typeof articleData.message['published-print'] !== 'undefined') {
    if (!articleData.message['published-print']['date-parts'][0][2]) {
      var ppdaytum = 1;
    } else {
      ppdaytum = articleData.message['published-print']['date-parts'][0][2];
    }
    var publishedPrintDate = new Date(Date.UTC(articleData.message['published-print']['date-parts'][0][0], (articleData.message['published-print']['date-parts'][0][1] - 1), ppdaytum));
  }
  return { publishedPrintDate, publishedOnlineDate};
}

/**
 * Determines if a Journal already exists with MongoDB (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise<boolean>} - True = journal exists, false it doesnt exist.
 */
const getArticleByDOI = async (data: String): Promise<boolean> => {
  const docCount = await Article.countDocuments({doi: data}).exec();
  let value = false;
  if (docCount != 0) { 
    value = true;
    const logText = "["+data+"] Already exists in database " 
    doiLogger.error(logText)
    throw new Error('Article Already Exists in the database');
  }
  
  return value;
}

