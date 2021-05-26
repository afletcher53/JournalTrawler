require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const articleData = {title: 'Hello123', doi: '123', journal: 'Facebook'};
const articleDataUpdate = {"title": 'Hello234', "doi": '123', "journal": 'Facebook'};
const databaseName = process.env.DB_NAME_TEST;
const databaseMongoUrl = process.env.DB_MONOGO_URL;


/**
 * deletes an Article using the API
 * @param {string} id - The id of the article to be deleted
 * @return {string} request - the request response
 **/
function deleteArticleByAPI(id) {
  const url = '/api/articles/'+ id;
  return request(app)
      .delete(url)
      .set({id: id})
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.message);
        expect(response.body.message)
            .toEqual(process.env.STRING_ARTICLE_DELETED);
      });
}

/**
 * Posts an article through the API
 * @param {Object} article - the article objection containing dummy data
 * @return {string} id  - the article id stored in the database
**/
function postArticleByAPI(article) {
  console.log(article)
  return request(app)
      .post('/api/articles')
      .send(article)
      .expect(200)
      .then((response) => {
        expect(response.body.title).toBe(article.title);
        expect(response.body.doi).toBe(article.doi);
        expect(response.body.journal).toBe(article.journal);
        expect(response.body.id).toBeTruthy();
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}

/**
 * Gets an article by ID through the API
 * @param {string} id - Id to return the article
 * @return {string} article - JSON response containing the dummy article
 */
function getArticleByAPI(id) {
  const url = '/api/articles/'+ id;
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
 * Updates an article through the API
 * @param {object} article - Article object with id
 * @return {string} Article ID
 */
function updateArticleByAPI(article) {
  const url = '/api/articles/'+ article.id;
  return request(app)
      .put(url)
      .send(article)
      .expect(200)
      .then((response) => {
        expect(response.body.message)
            .toEqual(process.env.STRING_ARTICLE_UPDATED);
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
function deleteArticlesByAPI(n) {
  const url = '/api/articles/';
  return request(app)
      .delete(url)
      .send()
      .expect(200)
      .then((response) => {
        expect(response.body.message);
      });
}


describe('API: Delete MULTIPLE articles', () => {
  test('It should response the POST,GET,PUT & DELETE routes /api/articles',
      async () => {
        // create 20 articles
        const tempArticleIds = [];
        for (i = 0; i < 19; i++) {
          const getArticle = await postArticleByAPI(articleData);
          tempArticleIds.push(getArticle.body.id);
        }
        await deleteArticlesByAPI(tempArticleIds.length);
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
