import crossrefConfig from '../config/crossref.config';
import { crossRefLogger } from '../../logger';
import axiosThrottle from 'axios-request-throttle';
import axios from 'axios';


const crossrefaxiosts = axios.create({
  baseURL: crossrefConfig.baseUrl,
  headers: crossrefConfig.header,
})

// register a new service interceptor
crossrefaxiosts.interceptors.request.use((config) => {
  const textlog = `[${config.method}:${config.url}]`;
  crossRefLogger.info(textlog);
  return config;
}, (error) => {
  crossRefLogger.error(error);
  return Promise.reject(error);
});

// determine the rate-limit
axiosThrottle.use(crossrefaxiosts, {requestsPerSecond: 5});

export default crossrefaxiosts

