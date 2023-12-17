import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../DBConnection.js';
export const CurrentSchoolYear = sequelize.define('CurrentSchoolYear', {
    fromYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    toYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
