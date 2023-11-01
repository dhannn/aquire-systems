import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const Record = sequelize.define('record', {
    recordId: {
        type: DataTypes.CHAR,
        primarykey: true,
    },
    recordName: {
        type: DataTypes.STRING,
    }
});