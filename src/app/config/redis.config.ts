import dotenv from 'dotenv';
dotenv.config();
export const redisHost = process.env.REDIS_HOST;
export const redisPort = Number(process.env.REDIS_PORT);

