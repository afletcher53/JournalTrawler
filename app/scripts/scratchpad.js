const crossrefaxios = require('../requests/crossref.requests');

crossrefaxios.service.get('journals/1939-1676').then((resp) => {
  console.log(resp.data);
});

