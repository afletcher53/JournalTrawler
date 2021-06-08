require('dotenv').config();
module.exports = {
    baseurl: process.env.CROSSREF_BASEURL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Credentials': true,
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'mailto:afletcher53@gmail.com'
    },
};
