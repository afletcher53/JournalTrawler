require('dotenv').config();
module.exports = {
    url: process.env.DB_MONOGO_URL + process.env.DB_NAME,
    testurl: process.env.DB_MONOGO_URL + process.env.DB_NAME_TEST,
};
