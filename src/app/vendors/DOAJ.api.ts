/**
 * Creates a DOAJ  configured instance of axios from the axios.vendors.ts class
 */

import Http from './axios.vendors';
import { doajBaseurl, doajHeaders } from '../config/doaj.config';
import doajLogger from '../loggers/doaj.logger.';
const axiosDOAJ = new Http(doajBaseurl, doajHeaders, doajLogger);
export default axiosDOAJ;
