import Joi from '@hapi/joi';
import db from '../models';
import { fetchJournalByISSN } from '../requests/crossref.service';
const Journal = db.journals;


const options = {
  abortEarly: false,
  allowUnknown:true,
  errors: {
    wrap: {
      label: '',
    },
  },
};



// Article Post Validation
export const articleCrossRefResponseValidation = (data: Express.Request) => {
  const schema = Joi.object({
    message: 
         Joi.object().keys({
          title: Joi.required(),
          DOI: Joi.required(),
          abstract: Joi.string(),
          publisher: Joi.required(),
          'reference-count': Joi.required(),
          'is-referenced-by-count': Joi.required(),
          type: Joi.required(),
          URL: Joi.required()
         })
  });
  return schema.validate(data, options, );
};

export const articleSingleValidation = (data) => {
  const schema = Joi.object({
    id:
          Joi
              .string()
              .required()
              .min(6),
  });

  return schema.validate(data, options);
};


//TODO: Export this to the functionfile

export const getJournalData = async (issn: string) => {


  const data = await fetchJournalByISSN(issn);

  let issnElectronic: any;
  let issnPrint: any;
  let crDate: Date;
  // const absSrcDoaj: Boolean = await checkDOAJJournalExistsDOAJ(issn)
  // lets extract the electronic and print journal and assign to variables
  const issns = data.data.message['issn-type'];
  if (Object.keys(issns).length > 0) {
    issns.forEach((element: { type: string; value: any; }) => {
      if (element.type === 'electronic') {
        issnElectronic = element.value;
      }
      if (element.type === 'print') {
        issnPrint = element.value;
      }
    });
  };

  // if not documented, assign the issn to issnPrint
  if (issnElectronic == undefined && issnPrint == undefined) {
    issnPrint = decodeURI(issn);
  }


  if (data.data.message['last-status-check-time']) crDate = new Date(data.data.message['last-status-check-time']);

  // lets format a Journal object to return here.
  const journal = new Journal({
    title: data.data.message.title ? data.data.message.title : null,
    publisher: data.data.message.publisher ? data.data.message.publisher : null,
    counts_totaldois: data.data.message.counts['total-dois'] ? data.data.message.counts['total-dois'] : null,
    counts_currentdois: data.data.message.counts['current-dois'] ? data.data.message.counts['current-dois'] : null,
    counts_backfiledois: data.data.message.counts['backfile-dois'] ? data.data.message.counts['backfile-dois'] : null,
    cr_parsed: false,
    cr_last_status_check_time: crDate ? crDate : null,
    issn_print: issnPrint ? issnPrint : null,
    issn_electronic: issnElectronic ? issnElectronic : null,
    // abstract_source_doaj: absSrcDoaj ? absSrcDoaj : null
  });


  return journal;
};

