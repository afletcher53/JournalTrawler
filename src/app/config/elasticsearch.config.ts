import dotenv from 'dotenv';
dotenv.config();
const elasticSearchUrl: string = process.env.ELASTICSEARCH_URL || 'localhost';
const elasticSearchPort: number =
  Number(process.env.ELASTICSEARCH_PORT) || 9200;
const elasticSearchPassword: string = process.env.ELASTICSEARCH_USERNAME || '';
const elasticSearchUsername: string = process.env.ELASTICSEARCH_PASSWORD || '';
const elasticSearchProtocol: string =
  process.env.ELASTICSEARCH_PROTOCOL || 'http';

export default {
  host: elasticSearchUrl,
  port: elasticSearchPort,
  protocol: elasticSearchProtocol,
  auth: `${elasticSearchUsername}:${elasticSearchPassword}`
};
