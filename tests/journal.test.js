require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const journalData = {title: 'Hello123', doi: '123', journal: 'Facebook'};
const journalDataUpdate = {title: 'Hello234', doi: '123', journal: 'Facebook'};
const databaseName = process.env.DB_NAME_TEST;
const databaseMongoUrl = process.env.DB_MONOGO_URL;
const apiUrl = '/api/journals/';

/**
 * deletes an Journal using the API
 * @param {string} id - The id of the Journal to be deleted
 * @return {string} request - the request response
 **/
function deleteJournalByAPI(id) {
  const url = apiUrl + id;
  return request(app)
      .delete(url)
      .set({id: id})
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.message);
        // expect(response.body.message)
        //     .toEqual(process.env.STRING_JOURNAL_DELETED);
      });
}

/**
 * Posts an Journal through the API
 * @param {Object} journal - the journal objection containing dummy data
 * @return {string} id  - the journal id stored in the database
**/
function postJournalByAPI(journal) {
  return request(app)
      .post(apiUrl)
      .send(journal)
      .expect(200)
      .then((response) => {
        // expect(response.body.title).toBe(journal.title);
        // expect(response.body.doi).toBe(journal.doi);
        // expect(response.body.journal).toBe(journal.journal);
        expect(response.body.id).toBeTruthy();
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}

/**
 * Gets an Journal by ID through the API
 * @param {string} id - Id to return the Journal
 * @return {string} Journal - JSON response containing the dummy Journal
 */
function getJournalByAPI(id) {
  const url = apiUrl + id;
  return request(app)
      .get(url)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBeTruthy();
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}

/**
 * Updates an Journal through the API
 * @param {object} journal - Journal object with id
 * @return {string} Journal ID
 */
function updateJournalByAPI(journal) {
  const url = apiUrl + journal.id;
  return request(app)
      .put(url)
      .send(journal)
      .expect(200)
      .then((response) => {
        // expect(response.body.message)
        //     .toEqual(process.env.STRING_JOURNAL_UPDATED);
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}

/**
 * deletes ALL JOURNAL using the API
 * @param {int} n - The number of JOURNAL to be deleted
 * @return {string} request - the request response
 **/
function deleteJournalsByAPI(n) {
  const url = apiUrl;
  return request(app)
      .delete(url)
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.message);
        expect(response.body.message)
            .toEqual(n+ ' ' + process.env.STRING_JOURNALS_DELETED);
      });
}


describe('API: Delete MULTIPLE journals', () => {
  test('It should response the POST,GET,PUT & DELETE routes /api/articles',
      async () => {
        // create 20 Journals
        const tempJournalIds = [];
        for (i = 0; i < 19; i++) {
          const getJournal = await postJournalByAPI(journalData);
          tempJournalIds.push(getJournal.body.id);
        }
        await deleteJournalsByAPI(tempJournalIds.length);
      });
});


describe('API: Create, retrieve, update and Delete a SINGLE article ', () => {
  test('It should response the POST,GET,PUT & DELETE routes /api/articles/:id',
      async () => {
        const getJournal = await postJournalByAPI(journalData);
        const tempJournalId = getJournal.body.id;
        let dummyJournal = await getJournalByAPI(tempJournalId);
        // check that the retrieved article matches the one passed.
        // expect(dummyJournal.body.title).toBe(journalData.title);
        // expect(dummyJournal.body.doi).toBe(journalData.doi);
        // expect(dummJournal.body.journal).toBe(journalData.journal);
        journalDataUpdate.id = tempJournalId;
        await updateJournalByAPI(journalDataUpdate);
        dummyJournal = await getJournalByAPI(tempJournalId);
        // check that the retrieved article matches the one passed.
        // expect(dummyJournal.body.title).toBe(journalDataUpdate.title);
        // expect(dummyJournal.body.doi).toBe(journalDataUpdate.doi);
        // expect(dummyJournal.body.journal).toBe(journalDataUpdate.journal);
        await deleteJournalByAPI(tempJournalId);
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
