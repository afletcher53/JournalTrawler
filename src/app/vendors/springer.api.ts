/**
 * Creates a Springer configured instance of axios from the axios.vendors.ts class
 */

import Http from './axios.vendors';
import { springerBaseurl, springerHeaders } from '../config/springer.config';
import crossrefLogger from '../loggers/crossref.logger';
const axiosDOAJ = new Http(springerBaseurl, springerHeaders, crossrefLogger);
export default axiosDOAJ;
