import db from '../../models';
const Journal = db.journals;

/**
 * Determines if a Journal already exists (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
export async function getJournalByISSN(data) {
  const docCount = await Journal.countDocuments(
    { $or: [{ issn_electronic: data }, { issn_print: data }] }).exec();
  let value = false;
  if (docCount != 0)
    value = true;
  return value;
}
