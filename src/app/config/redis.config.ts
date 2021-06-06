require('dotenv').config();

export const config = {  
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
};