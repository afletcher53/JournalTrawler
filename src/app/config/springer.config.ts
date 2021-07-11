import dotenv from 'dotenv';
import VendorHeader from '../Typescript/Interfaces/VendorHeader.interface';

dotenv.config();
export const springerBaseurl: string = process.env.SPRINGER_BASEURL;
export const springerAPIKey: string = process.env.SPRINGER_API_KEY;
export const springerHeaders: VendorHeader = {
  Accept: 'application/json',
  'Content-Type': process.env.CONTENT_TYPE,
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'mailto:' + process.env.API_MAILTO
};
