import dotenv from 'dotenv';
dotenv.config();
export const url = process.env.DB_MONOGO_URL + process.env.DB_NAME;
export const testurl = process.env.DB_MONOGO_URL + process.env.DB_NAME_TEST;
