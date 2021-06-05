import Bull from "bull";
import journalProcess from '../processes/journal.process';

const journalQueue = new Bull('journalQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

const options = {
  attempts: 2,
};



const addJournal = (data: any) => {
  console.log(data)
  journalQueue.add(data, options);
};

journalQueue.process(journalProcess);

export { addJournal }