require('dotenv').config();
const elasticSearchUrl: String = process.env.ELASTICSEARCH_URL || 'localhost';
const elasticSearchPort: Number = Number(process.env.ELASTICSEARCH_PORT) || 9200;
const elasticSearchPassword: String = process.env.ELASTICSEARCH_USERNAME || '';
const elasticSearchUsername: String = process.env.ELASTICSEARCH_PASSWORD || '';
const elasticSearchProtocol: String = process.env.ELASTICSEARCH_PROTOCOL || 'http';

export default {
    host: elasticSearchUrl,
    port: elasticSearchPort,
    protocol: elasticSearchProtocol,
    auth: `${elasticSearchUsername}:${elasticSearchPassword}`
}