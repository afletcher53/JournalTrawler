import axios from 'axios';


module.exports = class Service { //TODO remove this usage
/**
*
* @param {String} baseUrl base url for the axios object
* @param {String} header header object for the axios object
*/
  constructor(baseUrl: any, header: any) {
    const service = axios.create({
      baseURL: baseUrl,
      headers: header,
    });
    Object.assign(this, service);
  }
};


