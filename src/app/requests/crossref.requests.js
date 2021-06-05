const Service = require('../vendors/axios.vendors');
const crossrefConfig = require('../config/crossref.config');
const {crossRefLogger} = require('../../logger');
const axiosThrottle = require('axios-request-throttle');


const crossrefaxios = new Service(
    crossrefConfig.baseurl, crossrefConfig.headers);


// register a new service interceptor
crossrefaxios.interceptors.request.use((config) => {
  const textlog = `[${config.method}:${config.url}]`;
  crossRefLogger.info(textlog);
  return config;
}, (error) => {
  crossRefLogger.error(textlog);
  return Promise.reject(error);
});

// determine the rate-limit


axiosThrottle.use(crossrefaxios, {requestsPerSecond: 5});

module.exports = crossrefaxios;

