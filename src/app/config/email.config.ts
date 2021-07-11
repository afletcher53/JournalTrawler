import dotenv from 'dotenv';
dotenv.config();

export const emailApplicationPassword: string =
  process.env.EMAIL_APPLICATION_PASSWORD;
export const emailAccount: string = process.env.EMAIL_ACCOUNT;
