import Bull from "bull";
import articleProcess from '../processes/article.process';

const articleQueue = new Bull('articleQueue', { //TODO Set up configuration for this in ENV
  redis: {
    host: '127.0.0.1',
    port: 6379
  }
});

articleQueue.empty()

const options = {
  attempts: 2,
  delay: 100,
};


const addArticle = (data: any) => {
  articleQueue.add(data, options);
};


articleQueue.process(articleProcess);

export { addArticle}