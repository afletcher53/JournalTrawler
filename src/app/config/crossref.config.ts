import dotenv from 'dotenv';
import VendorHeader from '../Typescript/Interfaces/VendorHeader.interface';

dotenv.config();
export const crossrefBaseurl = String(process.env['CROSSREF_BASEURL']);
export const crossrefHeaders: VendorHeader = {
  Accept: 'application/json',
  'Content-Type': process.env['CONTENT_TYPE'],
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'mailto:' + process.env['API_MAILTO']
};
