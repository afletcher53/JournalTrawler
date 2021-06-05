const db = require('../models');
const Journal = db.journals;
const crossrefaxios = require('../requests/crossref.requests');

async function checkExists(issn) {
  const res = await crossrefaxios.head('journals/' + issn).catch((err) => {console.log(err)});
  if (typeof res !== 'undefined') {
    if (res.status == 200) {
      return true;
    }
  } else {
    return false;
  }
}


const getJournalData = async (issn) => {
  const data = await crossrefaxios.get('journals/' + issn);
  let issnElectronic;
  let issnPrint;
  let crDate;
  // lets extract the electronic and print journal and assign to variables
  const issns = data.data.message['issn-type'];
  if (Object.keys(issns).length > 1) {
    issns.forEach((element) => {
      if (element.type === 'electronic') {
        issnElectronic = element.value;
      }
      if (element.type === 'print') {
        issnPrint = element.value;
      }
    });
  };


  //if not documented, assign the issn to issnPrint
  if(issnElectronic == undefined && issnPrint == undefined) {
    issnPrint = issn;
  }


    if(data.data.message['last-status-check-time']) crDate = new Date(data.data.message['last-status-check-time']);

  // lets format a Journal object to return here.
  const journal = new Journal({
    title: data.data.message.title ? data.data.message.title : null,
    publisher: data.data.message.publisher ? data.data.message.publisher : null,
    // asjc: data.data.message.subjects[0].ASJC ? data.data.message.subjects[0].ASJC : null,
    // subject: data.data.message.subjects[0].name ? data.data.message.subjects[0].name : null,
    counts_totaldois: data.data.message.counts['total-dois'] ? data.data.message.counts['total-dois'] : null,
    counts_currentdois: data.data.message.counts['current-dois'] ? data.data.message.counts['current-dois'] : null,
    counts_backfiledois: data.data.message.counts['backfile-dois'] ? data.data.message.counts['backfile-dois'] : null,
    cr_parsed: false,
    cr_last_status_check_time: crDate ? crDate : null,

    issn_print: issnPrint ? issnPrint : null,
    issn_electronic: issnElectronic ? issnElectronic : null,
  });

  return journal;
};



const getJournalMetaData = async (issn) => {
  const data = await crossrefaxios.get('journals/' + issn + "/works?cursor=*");
  return data

};

module.exports.checkExists = checkExists;
module.exports.getJournalData = getJournalData;
module.exports.getJournalMetaData = getJournalMetaData;