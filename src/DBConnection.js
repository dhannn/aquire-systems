import { config } from "dotenv";
import { Sequelize }  from 'sequelize';

config();

const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

<<<<<<< HEAD

export const sequelize = new Sequelize('aquire', 'root', '12345',  {
=======
export const sequelize = new Sequelize('aquire', 'root', '12345',   {
>>>>>>> feaa6e52b7458192f4cfb65d145829b035a69863
  host: 'localhost',
  dialect: 'mysql',
});




