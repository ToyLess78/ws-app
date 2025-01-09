import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3005,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
};
