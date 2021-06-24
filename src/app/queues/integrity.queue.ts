import Bull from "bull";
import {redisHost, redisPort} from '../config/redis.config';
import { logJobCompleted, logJobFailed } from "../loggers/job.logger";
import integrityProcess from '../processes/integrity.process';

const integrityQueue = new Bull('integrityQueue', { 
  redis: {
    host: String(redisHost),
    port: Number(redisPort)
  }
});


const options = {
  attempts: 2,
  delay: 100,
};


const addIntegrity = (data: any) => {
    integrityQueue.add(data, options);
};

integrityQueue.on('global:completed', async (job) => {
  logJobCompleted('integrity', job);
});

integrityQueue.on('failed',  (job, error) => {
  logJobFailed('integrity', job, error);
});
integrityQueue.process(integrityProcess);

export { addIntegrity, integrityQueue };

