import Bull from "bull";
import articleProcess from '../processes/article.process';
import * as redis from '../config/redis.config'
import { logJobCompleted, logJobFailed } from "../loggers/job.loggers";

const articleQueue = new Bull('articleQueue', { 
  redis: {
    host: String(redis.config.host),
    port: Number(redis.config.port)
  }
});


const options = {
  attempts: 2,
  delay: 100,
};


const addArticle = async (data: any) => {
  const job = await articleQueue.add(data, options);
  return job
};

articleQueue.on('global:completed', async (job) => {
  logJobCompleted('article', job);
});

articleQueue.on('failed',  (job, error) => {
  logJobFailed('article', job, error);
});


articleQueue.process(articleProcess);

export { addArticle, articleQueue}