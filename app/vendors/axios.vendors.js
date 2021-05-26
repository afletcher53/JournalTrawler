const axios = require('axios');


module.exports = class Service {
/**
*
* @param {String} baseUrl base url for the axios object
* @param {String} header header object for the axios object
*/
  constructor(baseUrl, header) {
    const service = axios.create({
      baseURL: baseUrl,
      headers: header,
    });
    Object.assign(this, service);
  }
};


