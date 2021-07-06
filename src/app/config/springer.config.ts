import dotenv from 'dotenv';
dotenv.config();
export const springerBaseurl = process.env.SPRINGER_BASEURL;
export const springerAPIKey = process.env.SPRINGER_API_KEY;
export const springerHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'mailto:' + process.env.API_MAILTO
};
