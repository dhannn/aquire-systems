import { config } from "dotenv";
import { Sequelize }  from 'sequelize';

config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

export const sequelize = new Sequelize('aquire', 'root', '123456789', {
  host: 'localhost',
  dialect: 'mysql',
});




