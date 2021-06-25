
import fs from 'fs';
import http from 'http';
import https from 'https';
import Redis from 'ioredis';
import path from 'path';
import app from './app';
import {redisHost, redisPort} from './app/config/redis.config';
import systemLogger from './app/loggers/system.logger';
const PORT = process.env.PORT;
const SSLPORT = process.env.HTTPSPORT;
const redis = new Redis(redisPort, redisHost);

redis.on('connect',
    function() {
      const httpServer = http.createServer(app);
      const httpsServer = https.createServer({
        key: fs.readFileSync(path.join('cert', 'key.pem')),
        cert: fs.readFileSync(path.join('cert', 'cert.pem')),
      }, app);


      try {
        httpServer.listen(PORT, () => {
          systemLogger.info(`Server running at: http://localhost:${PORT}`);
        });
        httpsServer.listen(SSLPORT, () => {
          systemLogger.info(`Server running at: https://localhost:${SSLPORT}`);
        });
      } catch (e) {
        systemLogger.error(e);
      }
    });
