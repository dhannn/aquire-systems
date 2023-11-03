
import { Sequelize }  from 'sequelize';

export const sequelize = new Sequelize('SQLTest', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});




