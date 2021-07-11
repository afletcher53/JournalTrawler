/**
 * Response strings for Article Operations
 */
enum ArticleOperations {
  /**
   * Response string for all articles sent
   */
  ARTICLES_SENT = 'All Articles Sent',

  /**
   * Response string for multiple articles delete operation
   */
  ARTICLES_DELETED = 'All articles were deleted successfully',

  /**
   * Response string for single article delete operation
   */
  ARTICLE_DELETED = 'Article was deleted successfully!',

  /**
   * Response string for single article update operation
   */
  ARTICLE_UPDATED = 'Article was updated successfully!',

  /**
   * Response string for ERROR when article create operation
   */
  ERROR_ARTICLE_CREATED = 'Some error occurred while creating the Article!',

  /**
   * Response string for ERROR when article request operation
   */
  ERROR_ARTICLES_GET = 'Some error occurred while requesting the Article!',

  /**
   * Response string for ERROR when post article operation on EMPTY post
   */
  ERROR_ARTICLE_POST = 'Data to update can not be empty!'
}

export default ArticleOperations;
