const Service = require('../vendors/axios.vendors');
const internalConfig = require('../config/internal.config');
const {systemLogger} = require('../loggers/logger');
// auth0 stuff
// const {token} = require('../scripts/get-access-token');
const internalaxios = new Service(
    internalConfig.baseurl, internalConfig.headers);

// register a new service interceptor
internalaxios.interceptors.request.use(async (config) => {
  // auth0 stuff
  // const authToken = await token();
  // config.headers = {
  //   'Authorization': `Bearer ${authToken.access_token}`};
  const textlog = `[${config.method}:${config.url}]`;
  systemLogger.info(textlog);
  return config;
}, (error) => {
  const textlog = `[${error}:]`;
  systemLogger.error(textlog);
  console.log(error);
  return Promise.reject(error);
});
internalaxios.interceptors.response.use(function(response) {
  // Do something with response data
  return response;
}, function(error) {
  // Do something with response error
  const textlog = `[${error.config.method}:${error.config.url}]`;
  systemLogger.error(textlog);
  return Promise.reject(error);
});
export default internalaxios

