import Bull from "bull";
import articleProcess from '../processes/article.process';
import * as redis from '../config/redis.config'

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


const addArticle = (data: any) => {
  articleQueue.add(data, options);
};


articleQueue.process(articleProcess);

export { addArticle}