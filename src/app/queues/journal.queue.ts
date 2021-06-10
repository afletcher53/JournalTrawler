import Bull from "bull";
import journalProcess from '../processes/journal.process';
import * as redis from '../config/redis.config'
const journalQueue = new Bull('journalQueue', {
  redis: {
    host: String(redis.config.host),
    port: Number(redis.config.port)
  }
});

const options = {
  attempts: 2,
};



const addJournal = (data: any) => {
  journalQueue.add(data, options);
};

import { logJobCompleted, logJobFailed } from "../loggers/job.loggers";

journalQueue.on('global:completed', async (job) => {
  logJobCompleted('journal', job);
});

journalQueue.on('failed',  (job, error) => {
  logJobFailed('journal', job, error);
});


journalQueue.process(journalProcess);

export { addJournal, journalQueue }


