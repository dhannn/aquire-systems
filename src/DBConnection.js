
import { Sequelize }  from 'sequelize';

export const sequelize = new Sequelize('aquireDB', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});




