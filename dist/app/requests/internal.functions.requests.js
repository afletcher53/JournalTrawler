"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const internal_requests_1 = __importDefault(require("../requests/internal.requests"));
module.exports = async function postJournalByISSN(issn) {
    internal_requests_1.default.post('/api/journals', { issn: issn }).then((res) => {
        if (res.status == 200 && res.statusText == 'OK') {
            console.log('Journal added with ISSN ' + issn);
        }
    }).catch(function (error) {
        if (error.response) {
            // Request made and server responded
            console.log(error.response.status);
            console.log(error.message);
        }
        else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        ;
    });
};
//# sourceMappingURL=internal.functions.requests.js.map