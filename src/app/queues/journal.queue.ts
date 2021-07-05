import Bull from 'bull';
import { redisHost, redisPort } from '../config/redis.config';
import { logJobCompleted, logJobFailed } from '../loggers/job.logger';
import journalProcess from '../processes/journal.process';
const journalQueue = new Bull('journalQueue', {
  redis: {
    host: String(redisHost),
    port: Number(redisPort)
  }
});

const options = {
  attempts: 2
};

const addJournal = (data: any) => {
  journalQueue.add(data, options);
};

journalQueue.on('global:completed', async (job) => {
  logJobCompleted('journal', job);
});

journalQueue.on('failed', (job, error) => {
  logJobFailed('journal', job, error);
});
journalQueue.process(journalProcess);

export { addJournal, journalQueue };
