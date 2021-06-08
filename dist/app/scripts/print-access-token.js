const { token } = require('./get-access-token');
token().then((a) => {
    console.log(a);
});
