import dotenv from 'dotenv';
import VendorHeader from '../Typescript/Interfaces/VendorHeader.interface';

dotenv.config();
export const doajBaseurl: string = process.env.DOAJ_BASEURL;
export const doajHeaders: VendorHeader = {
  Accept: 'application/json',
  'Content-Type': process.env.CONTENT_TYPE,
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'mailto:' + process.env.API_MAILTO
};
