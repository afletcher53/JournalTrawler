import db from '../models';
const Journal = db.journals;
const Article = db.articles;
/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
export async function mongoCheckJournalExistsByISSN(data:any): Promise<Boolean> {
  const docCount = await Journal.countDocuments(
    { $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
  let value = false;
  if (docCount != 0)
    value = true;
  return value;
}


/**
 * Determines if a Article already exists (via doi )
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
 export async function mongoCheckArticleExistsByDOI(data: any): Promise<boolean> {
    const docCount = await Article.countDocuments({doi: data}).exec();
    let value = false;
    if (docCount != 0) {
      value = true;
    }
    return value;
  }
  

/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise} - True = journal exists, false it doesnt exist.
 */
export async function mongofetchJournalByISSN(data: any): Promise<any> {
    const journal = await Journal.find(
      { $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
  return journal
  }

export async function mongoSaveJournal(journal: any) {
    return journal
      .save(journal.data);
  }
  
  
export  function mongoFindJournalWhere(condition) {
    return Journal.find(condition);
  }
  
export  function mongoFindJournalById(req: any) {
    return Journal.findById(req.params.id);
  }
  
export  function mongoFindJournalByIdAndUpdate(id: any, req: any) {
    return Journal.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
  }
  
export function mongoFindJournalByIdAndRemove(req: any) {
    return Journal.findByIdAndRemove(req.params.id, { useFindAndModify: false });
  }
  
export function mongoDeleteAllJournals() {
    return Journal.deleteMany({});
  }
  
 export function mongoeFindJournalWhere2(condition) {
    return Journal.find(condition);
  }
  