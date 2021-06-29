/**
 * Test literal string file for use with Jest Tests
 */


enum TestLiterals {

    // Digital Object Identifier of a known digital object to exist
    DOI_EXISTS_CROSSREF = '10.18849/ve.v2i1.50',

    // International Standard Serial Number of a Journal known to exist on Crossref, in this case Veterinary Evidence
    ISSN_EXISTS_CROSSREF = '2396-9776',

    // International Standard Serial Number of a Jorunal known NOT to exist
    ISSN_DOESNT_EXIST = '1234-1234',

    // Title of the known ISSN
    ISSN_EXISTS_CROSSREF_TITLE = 'Veterinary Evidence'

}

export default TestLiterals;
