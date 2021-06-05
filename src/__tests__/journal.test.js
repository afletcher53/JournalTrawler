require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const journalData = {'issn': '2396-9776'};
const databaseName = process.env.DB_NAME_TEST;
const databaseMongoUrl = process.env.DB_MONOGO_URL;

/**
 * Posts an article through the internal API
 * @param {Object} journal - the article objection containing dummy data
 * @return {string} id  - the article id stored in the database
**/
function postArticleByAPI(journal) {
  return request(app)
      .post('/api/journals')
      .send(journal)
      .expect(200)
      .then((response) => {
        expect(response.body.data.attributes.title).toBe('Veterinary Evidence');
        expect(response.body.data.attributes.doi).toBe(journal.doi);
        expect(response.body.data.id).toBeTruthy();
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}

/**
 * Gets an article by ID through the API
 * @param {string} id - Id to return the article
 * @param {object} journal - journal to check against
 * @return {string} article - JSON response containing the dummy article
 */
function getJournalByAPI(id, journal) {
  const url = '/api/journals/'+ id;

  return request(app)
      .get(url)
      .expect(200)
      .then((response) => {
        expect(response.body.data.attributes.title).toBe(journal.body.data.attributes.title);
        expect(response.body.data.attributes.issn).toBe(journal.body.data.attributes.issn);
        expect(response.body.data.id).toBe(journal.body.data.id);
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}


/**
 * deletes ALL Article using the API
 * @param {int} n - The number of articles to be deleted
 * @return {string} request - the request response
 **/
function deleteArticlesByAPI() {
  const url = '/api/journals/';
  return request(app)
      .delete(url)
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.message);
      });
}

// TODO: Add a journal and check response

describe('API: Delete MULTIPLE articles', () => {
  test('It should response the POST,GET,PUT & DELETE routes /api/articles',
      async () => {
        await deleteArticlesByAPI();
        const journal = await postArticleByAPI(journalData);
        const journalId = journal.body.data.id;
        await getJournalByAPI(journalId, journal);
        await deleteArticlesByAPI();
      });
});


const mongoose = require('mongoose');

beforeAll(async () => {
  const url = `${databaseMongoUrl}${databaseName}`;
  await mongoose.connect(url, {useNewUrlParser: true});
});

afterAll(async () => {
  // Closes the Mongoose connection
  await mongoose.connection.close();
});

beforeEach(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
