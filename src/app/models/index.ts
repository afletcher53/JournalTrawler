import mongoose from 'mongoose';
import { testurl, url } from '../config/db.config';


const db = {
  journals: require('./journal.model').default(mongoose),
  integrity: require('./integrity.model').default(mongoose),
  articles: require('./article.model').default(mongoose),
  mongoose: mongoose,
  url: url
};

if (process.env.NODE_ENV=='test') {
  db.url = testurl;
} else {
  db.url = url;
}

export default db;
