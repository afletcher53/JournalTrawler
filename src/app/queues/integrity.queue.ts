import Bull from "bull";
import * as redis from '../config/redis.config';
import { logJobCompleted, logJobFailed } from "../loggers/job.logger";
import integrityProcess from '../processes/integrity.process';

const integrityQueue = new Bull('integrityQueue', { 
  redis: {
    host: String(redis.config.host),
    port: Number(redis.config.port)
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

