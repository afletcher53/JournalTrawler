/**
 * Enum for Jobs
 */

/**
 * String Literals for Response Messages
 */
enum jobLiterals {
  MISSING_DOIS = 1,

  DATA_COMPLETENESS_SINGLE = 2,

  //update a;; DOIS for a single held ISSN
  UPDATE_ISSN_SINGLE = 3,

  //update all DOIS for all held ISSNs
  UPDATE_ISSN_ALL = 4
}

export default jobLiterals;
