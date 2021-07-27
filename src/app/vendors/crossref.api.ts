/**
 * Creates a crossref  configured instance of axios from the axios.vendors.ts class
 */

import Http from './axios.vendors';
import { crossrefBaseurl, crossrefHeaders } from '../config/crossref.config';
import crossrefLogger from '../loggers/crossref.logger';
const axiosCR = new Http(crossrefBaseurl, crossrefHeaders, crossrefLogger);
export default axiosCR;
