import dotenv from 'dotenv';
dotenv.config();
export const crossrefBaseurl = process.env.CROSSREF_BASEURL;
export const crossrefHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'mailto:afletcher53@gmail.com'
};
