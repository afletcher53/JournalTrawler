import dotenv from 'dotenv';
dotenv.config();

const auth0 = {
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  url: process.env.AUTH0_URL,
  audience: process.env.AUTH0_AUDIENCE
};

export default { auth0 };
