

import { config } from "dotenv";
import { Sequelize }  from 'sequelize';

config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  retry: {
    match: [/Deadlock/i, Sequelize.ConnectionError], // Retry on connection errors
    max: 3, // Maximum retry 3 times
    backoffBase: 3000, // Initial backoff duration in ms. Default: 100,
    backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
  },
  pool: {
    max: 80,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});