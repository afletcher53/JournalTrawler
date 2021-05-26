/* eslint-disable require-jsdoc */
// eslint-disable-next-line max-len
const journalISSNs = ['2226-4310', '2077-0472', '2073-4395', '2076-2615', '2079-6382', '2076-3921', '2076-3417', '2073-4433', '2075-1680', '2079-7737', '2227-9059', '2218-273X', '2079-6374', '2076-3425', '2075-5309', '2072-6694', '2073-4344', '2073-4409', '2227-9040', '2227-9067', '2079-6412', '2073-4352', '1467-3045', '2075-4418', '1424-2818', '2504-446X', '2079-9292', '1996-1073', '1099-4300', '2311-5637', '2571-6255', '2410-3888', '2304-8158', '1999-4907', '2504-3110', '2310-2861', '2073-4425', '2227-9032', '2311-7524', '2075-4450', '1660-4601', '1422-0067', '2220-9964', '2308-3425', '2077-0383', '2309-608X', '2077-1312', '2075-4426', '2075-1729', '2075-1702', '2312-7481', '1660-3397', '1996-1944', '2227-7390', '1648-9144', '2077-0375', '2218-1989', '2075-4701', '2072-666X', '2076-2607', '2075-163X', '1420-3049', '2079-4991', '2072-6643', '2076-0817', '1424-8247', '1999-4923', '2304-6732', '2223-7747', '2073-4360', '2227-9717', '2072-4292', '1424-8220', '2297-8739', '2071-1050', '2073-8994', '2379-139X', '2305-6304', '2072-6651', '2218-1997', '2076-393X', '2306-7381', '1999-4915', '2073-4441'];
const journalISSNsShort = ['2226-4310', '2077-0472', '2073-4395', '2076-2615', '2079-6382', '2076-3921', '2076-3417', '2073-4433', '2075-1680'];

const internal = require('../requests/internal.requests');


// we want to loop through the array
async function runall() {
  for (const element of journalISSNs) {
    postServerRequest(element);
  }
}

async function postServerRequest(issn) {
  internal.post('/api/journals', {issn: issn}).then((res) => {
    if (res.status == 200 && res.statusText == 'OK') {
      console.log('Journal added with ISSN ' + issn );
    }
  }).catch(function(error) {
    if (error.response) {
      // Request made and server responded
      console.log(error.response.status);
      console.log(error.message);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    };
  });
}


runall();
