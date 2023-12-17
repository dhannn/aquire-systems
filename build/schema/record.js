import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../DBConnection.js';
export const Record = sequelize.define('record', {
    recordId: {
        type: DataTypes.CHAR,
        allowNull: false,
        primaryKey: true,
    },
    recordName: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
