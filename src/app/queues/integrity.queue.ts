import Bull from "bull";
import integrityProcess from '../processes/integrity.process';
import * as redis from '../config/redis.config'

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


integrityQueue.process(integrityProcess);

export { addIntegrity }