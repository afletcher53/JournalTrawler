import dotenv from 'dotenv';
dotenv.config();
export const redisHost: string = process.env['REDIS_HOST'];
export const redisPort: number = Number(process.env['REDIS_PORT']);
