const axios = require('axios');
require('dotenv').config();
const {auth0} = require('../models/auth0.model').default;

/**
 * Function to get an access token from the Auth0 servers
 * @return {Promise} Returns the result of the axios promise to Auth0
 */
function getToken() {
  // get the info we need
  return axios
      .post(auth0.url, {
        client_id: auth0.clientId,
        client_secret: auth0.clientSecret,
        grant_type: 'client_credentials',
        audience: auth0.audience,
      })
      .then((res) => res.data)
      .catch((err) => err);
}

let tokenPromise;

const token = async () => {
  if (!tokenPromise) {
    tokenPromise = await getToken();
  }
  return tokenPromise;
};

module.exports.token = token;
