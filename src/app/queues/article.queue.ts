import Bull from "bull";
import * as redis from '../config/redis.config';
import { logJobCompleted, logJobFailed } from "../loggers/job.logger";
import { getAbstract } from "../processes/abstract.process";
import articleProcess from '../processes/article.process';


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
  await job.finished().then(()=>{
    getAbstract(job)
  }
  );
  return job
};

articleQueue.on('global:completed', async (job) => {
  logJobCompleted('article', job);
});

articleQueue.on('failed',  (job, error) => {
  logJobFailed('article', job, error);
});


articleQueue.process(articleProcess);

export { addArticle, articleQueue };

