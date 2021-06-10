import Bull from "bull";
import integrityProcess from '../processes/integrity.process';
import * as redis from '../config/redis.config'
import { logJobCompleted, logJobFailed } from "../loggers/job.loggers";

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
  logJobCompleted('article', job);
});

integrityQueue.on('failed',  (job, error) => {
  logJobFailed('article', job, error);
});
integrityQueue.process(integrityProcess);

export { addIntegrity, integrityQueue }