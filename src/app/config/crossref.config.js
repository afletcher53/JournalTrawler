require('dotenv').config();
module.exports = {
  baseurl: process.env.CROSSREF_BASEURL,
  headers: {'User-Agent': 'mailto:afletcher53@gmail.com'},
};
