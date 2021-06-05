
'use strict';
import app from './app';
// set port, listen for requests
const PORT = process.env.PORT || 8080;
const SSLPORT = process.env.HTTPSPORT || 8083;
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';

const httpServer = http.createServer(app);
const httpsServer = https.createServer({
  key: fs.readFileSync(path.join('cert', 'key.pem')),
  cert: fs.readFileSync(path.join('cert', 'cert.pem')),
}, app);


try {
  httpServer.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
  httpsServer.listen(SSLPORT, () => {
    console.log(`Server running at: https://localhost:${SSLPORT}`);
  });
} catch (e) {
  console.log(e);
}

