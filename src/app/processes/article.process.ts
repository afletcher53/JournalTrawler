
import { AxiosResponse } from 'axios';
import {Job} from 'bull';
import db from '../models';
import crossrefaxiosts from  '../requests/crossrefts.requests';
export const Article = db.articles;

// TODO: clean up code and JSDOC it
const articleProcess = async (job:Job) => {
  
   // check if article exists in database first
  const a = await getArticleByDOI(job.data.doi);
  console.log(job.data)
  if (a) throw new Error('Article Already Exists in the database');
  var articleData = await getArticle(job.data.doi)

  // Create Dates from given data
  var { ppdatum, podatum } = getDate(articleData);
  const article = setArticleDetails(job.data.doi, job.data.issn_print, job.data['issn_print'], articleData, podatum, ppdatum);

  // save article
  article
      .save(article)
      .catch((err: Error) => {
        console.log(err)
      });
};

export default articleProcess;

function setArticleDetails(doi: String, print_issn: string, online_issn: String,articleData: AxiosResponse<any>, podatum: Date, ppdatum: Date) {  //TODO give podatum/ppdatum a better name
  // TODO: Need to add the print/online issn to the article, currently reading as UNDEFINED for some reason

  console.log(print_issn) //TODO this is returning undefined for some reason?

  return new Article({
    crossref_url: encodeURI('https://api.crossref.org/works/' + doi),
    journal_issn_print: print_issn ? print_issn : null,
    journal_issn_online: online_issn ? online_issn : null,
    publisher: articleData.data.message.publisher ? articleData.data.message.publisher : 0,
    reference_count: articleData.data.message['reference-count'] ? articleData.data.message['reference-count'] : 0,
    is_referenced_by_count: articleData.data.message['is-referenced-by-count'] ? articleData.data.message['is-referenced-by-count'] : 0,
    published_online: podatum ? podatum : null,
    published_print: ppdatum ? ppdatum : null,
    type: articleData.data.message.type ? articleData.data.message.type : null,
    abstract: articleData.data.message.abstract ? articleData.data.message.abstract : null,
    title: articleData.data.message.title ? String(articleData.data.message.title) : null,
    url: articleData.data.message['URL'] ? articleData.data.message['URL'] : null,
    doi: articleData.data.message['DOI'] ? articleData.data.message['DOI'] : null,
    cr_parsed: false
  });
}

/**
 * Function to extract date from the axios response. 
 * @param articleData 
 * @returns Two strings
 */
function getDate(articleData: AxiosResponse<any>) {
  if (typeof articleData.data.message['published-online'] !== 'undefined') {
    //Set day to one if not provided
    if (!articleData.data.message['published-online']['date-parts'][0][2]) {
      var daytum = 1;
    } else {
      daytum = articleData.data.message['published-online']['date-parts'][0][2];
    }
    var podatum = new Date(Date.UTC(articleData.data.message['published-online']['date-parts'][0][0], (articleData.data.message['published-online']['date-parts'][0][1] - 1), daytum));
  }

  if (typeof articleData.data.message['published-print'] !== 'undefined') {
    if (!articleData.data.message['published-print']['date-parts'][0][2]) {
      var ppdaytum = 1;
    } else {
      ppdaytum = articleData.data.message['published-print']['date-parts'][0][2];
    }
    var ppdatum = new Date(Date.UTC(articleData.data.message['published-print']['date-parts'][0][0], (articleData.data.message['published-print']['date-parts'][0][1] - 1), ppdaytum));
  }
  return { ppdatum, podatum };
}

/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise<boolean>} - True = journal exists, false it doesnt exist.
 */
 async function getArticleByDOI(data: String): Promise<boolean> {
  const docCount = await Article.countDocuments({doi: data}).exec();
  let value = false;
  if (docCount != 0) value = true;
  return value;
}



/**
 * Function to get crossref data from API
 * @param {String} doi The doi to be searched on crossref 
 * @returns {Promise<AxiosResponse<any>>} 
 */
async function getArticle(doi: String): Promise<AxiosResponse<any>> {

  let url = encodeURI('https://api.crossref.org/works/' + doi )
  try {
    const response = await crossrefaxiosts.get(url);
    return response
  } catch (error) {
    // // handle error
    console.log(error);
  }
}
