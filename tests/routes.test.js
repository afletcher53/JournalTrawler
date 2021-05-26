require('dotenv').config();
const request = require('supertest');
const app = require('../app');
const randomData = {title: 'Hello123', doi: '123', journal: 'Facebook'};
const databaseName = process.env.DB_NAME_TEST;
const databaseMongoUrl = process.env.DB_MONOGO_URL;
const fs = require('fs');
const dir = './app/routes';
const files = fs.readdirSync(dir);
const fileList = [];


for (const file of files) {
  fileList.push(file.split('.')[0]);
}

const {token} = require('../app/scripts/get-access-token');

/**
 * converts the route name into the rest API url
 * @param {string} route - route name
 * @return {string} formed route from the input
 */
function formAPIUrl(route) {
  return '/api/' + route + '/';
}


/**
 * Posts an object to each API route using JWT Token Authorisation of Auth0
 * @param {Object} data the data objection containing dummy data
 * @param {String} route the route to be tested
 * @return {Object}  the resposne from the API
**/
async function postByAPISecure(data, route) {
  const authToken = await token();
  return request(app)
      .post(route)
      .set('Authorization', 'Bearer ' + authToken.access_token)
      .send(data)
      .expect(400)
      .then((response) => {
        expect(response.error);
        expect(response.headers['content-type'])
            .toBe(process.env.CONTENT_TYPE);
        return response;
      });
}

/**
 * Posts an object to each API route without JWT Authorisation
 * @param {Object} data the data objection containing dummy data
 * @param {String} route the route to be tested
 * @return {Object}  the resposne from the API
**/
async function postByAPIInsecure(data, route) {
  return request(app)
      .post(route)
      .send(data)
      .expect(401)
      .then((response) => {
        expect(response.error);
        return response;
      });
}


/**
 * Gets API endpoint to test JWT authorisation
 * @param {String} route the route to be tested
 * @param {Boolean} authorise Weather to use authorisation
 * @return {Object}  the resposne from the API
**/
async function getByAPI(route, authorise = false) {
  const authToken = authorise ? await token() : null;
  const returnValue = authorise ? 200 : 401;
  if (authorise) {
    return request(app)
        .get(route)
        .set('Authorization', 'Bearer ' + authToken.access_token)
        .expect(returnValue)
        .then((response) => {
          return response;
        });
  } else {
    return request(app)
        .get(route)
        .expect(returnValue)
        .then((response) => {
          expect(response.error);
          return response;
        });
  }
}


fileList.forEach((e) => {
  e = formAPIUrl(e);
  describe('API Endpoints', () => {
    test('Test JWT Authorisation token generation ' + e,
        async () => {
          await postByAPISecure(randomData, e);
        });
    test('Test JWT Authorisation ' + e,
        async () => {
          await postByAPIInsecure(randomData, e);
          await getByAPI(e, true);
          await getByAPI(e);
        });
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

