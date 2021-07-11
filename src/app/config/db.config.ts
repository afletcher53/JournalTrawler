import dotenv from 'dotenv';
dotenv.config();
export const url: string = process.env.DB_MONOGO_URL + process.env.DB_NAME;
export const testurl: string =
  process.env.DB_MONOGO_URL + process.env.DB_NAME_TEST;
