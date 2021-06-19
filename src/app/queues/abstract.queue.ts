import Bull from "bull";
import * as redis from '../config/redis.config';
import { logJobCompleted, logJobFailed } from "../loggers/job.logger";
import { getAbstract } from "../processes/abstract.process";

const abstractQueue = new Bull('abstractQueue', {
  redis: {
    host: String(redis.config.host),
    port: Number(redis.config.port)
  }
});

const options = {
  attempts: 2,
};



const addJournal = (data: any) => {
  abstractQueue.add(data, options);
};


abstractQueue.on('global:completed', async (job) => {
  logJobCompleted('journal', job);
});

abstractQueue.on('failed',  (job, error) => {
  logJobFailed('journal', job, error);
});


abstractQueue.process(getAbstract);

export { addJournal, abstractQueue };


