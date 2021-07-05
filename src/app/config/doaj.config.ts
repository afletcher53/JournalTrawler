import dotenv from 'dotenv';
dotenv.config();
export const doajBaseurl = process.env.DOAJ_BASEURL;
export const doajHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'mailto:afletcher53@gmail.com'
};
