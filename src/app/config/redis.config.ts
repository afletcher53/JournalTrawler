require('dotenv').config();

export const config = {  
    host: String(process.env.REDIS_HOST),
    port: Number(process.env.REDIS_PORT)
};