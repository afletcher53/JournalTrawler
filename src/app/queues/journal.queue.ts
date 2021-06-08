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

journalQueue.process(journalProcess);

export { addJournal }