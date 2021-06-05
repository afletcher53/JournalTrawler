
import axios from 'axios';
import { Job } from 'bull';
import { underline } from 'chalk';
import { addArticle } from '../queues/article.queue';
import { getJournalMetaData } from '../validation/crossref.validation';


const journalProcess = async (job: Job) => {
  // get the journal data and add here

  // get all the DOIS and add
  getDOIs(job.data.issn)

};

export default journalProcess;

async function getDOIs(issn: String) {

  const journalData = await getJournalMetaData(issn);

  getISSNSingle(issn)
  .then((data: any[]) => {
      data.forEach((element: { [x: string]: any; }) => {
        console.log("Added Document")
        const doi = {
          doi: element['DOI'],
          print_issn: element['ISSN'][0],
          online_issn: element['ISSN'][0]
        };
        addArticle(doi)
      });
  })
}

async function getISSN(issn: String, rows?: Number, cursor?: string, data: any = []) {
  if (cursor == undefined) {
    cursor = '*'
  }

  if (rows == undefined) {
    rows = 1000
  }

  cursor = cursor.toString()
  let url = 'https://api.crossref.org/journals/' + issn + '/works?rows=' + rows + '&cursor=' + encodeURIComponent(cursor)
  console.log(url)
  try {
    const response = await axios.get(url);
    if (response.data.message['next-cursor'] == cursor)
      return data;
    data.push(...response.data.message.items);
    console.log(data.length)
    return getISSN(issn, rows, response.data.message['next-cursor'], data);
  } catch (error) {
    // // handle error
    console.log(error);
  }
}


async function getISSNSingle(issn: String, data: any = []) {

  let url = 'https://api.crossref.org/journals/' + issn + '/works?sample=10'
  console.log(url)
  try {
    const response = await axios.get(url);
    data.push(...response.data.message.items);
  
    return data;
  } catch (error) {
    // // handle error
    console.log(error);
  }
}
