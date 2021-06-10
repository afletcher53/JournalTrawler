import db from '../../models';
const Article = db.articles;


/**
 * Determines if a Article already exists (via doi )
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {boolean} - True = journal exists, false it doesnt exist.
 */
async function getArticleByDOI(data) {
  const docCount = await Article.countDocuments({doi: data}).exec();
  let value = false;
  if (docCount != 0) {
    value = true;
  }
  return value;
}
exports.getArticleByDOI = getArticleByDOI;
