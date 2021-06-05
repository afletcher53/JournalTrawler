
const request = require('supertest');
const app = require('../../app');

/**
 * Issue a GET to each API route
 * @param {String} route the route to be tested
 * @param {String} done the route to be tested
**/
function getByAPI(route, done) {
  request(app)
      .get(route)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
}


module.exports.getByAPI = getByAPI;

