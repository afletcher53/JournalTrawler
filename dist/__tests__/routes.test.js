"use strict";
require('dotenv').config();
const databaseName = process.env.DB_NAME_TEST;
const databaseMongoUrl = process.env.DB_MONOGO_URL;
const fs = require('fs');
const dir = './app/routes';
const files = fs.readdirSync(dir);
const fileList = [];
const { getByAPI } = require('./functions/routes');
for (const file of files) {
    fileList.push(file.split('.')[0]);
}
/**
 * converts the route name into the rest API url
 * @param {string} route - route name
 * @return {string} formed route from the input
 */
function formAPIUrl(route) {
    return '/api/' + route + '/';
}
fileList.forEach((e) => {
    e = formAPIUrl(e);
    describe('API Endpoints', () => {
        it('respond with 200', function (done) {
            getByAPI(e, done);
        });
    });
});
const mongoose = require('mongoose');
beforeAll(async () => {
    const url = `${databaseMongoUrl}${databaseName}`;
    await mongoose.connect(url, { useNewUrlParser: true });
});
afterAll(async () => {
    await mongoose.connection.close();
});
beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});
