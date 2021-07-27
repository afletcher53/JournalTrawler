import { Http } from '../vendors/axios.vendors';
import { crossrefBaseurl, crossrefHeaders } from '../config/crossref.config';
import crossrefLogger from '../loggers/crossref.logger';
const axiostest = new Http(crossrefBaseurl, crossrefLogger, crossrefHeaders);

axiostest.get('works/10.1155/2014/239410').then((res) => {
  console.log(res);
});
