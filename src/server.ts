
'use strict';
import app from './app';
const PORT = process.env.PORT || 8080;
const SSLPORT = process.env.HTTPSPORT || 8083;
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';
import Redis from "ioredis";
import * as redisconfig from './app/config/redis.config'
const redis = new Redis(redisconfig.config.port, redisconfig.config.host);

redis.on('connect', function () { 
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
 });
