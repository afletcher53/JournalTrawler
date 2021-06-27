import doiLogger from '../../loggers/doi.logger';
import db from '../../models';
const Article = db.articles;

/**
 * Determines if a Journal already exists with MongoDB (via ISSN numer)
 * @param {string} data - The ISSN number of the Journal to be checked
 * @return {Promise<boolean>} - True = journal exists, false it doesnt exist.
 */
const checkArticlesExistsInMongoDB = async (data: string): Promise<boolean> => {
  const docCount = await Article.countDocuments({ doi: data }).exec();
  let value = false;
  if (docCount !== 0) {
    value = true;
    const logText = `[${data}] Already exists in database`;
    doiLogger.error(logText);
    throw new Error('Article Already Exists in the database');
  }

  return value;
};

export default checkArticlesExistsInMongoDB;
