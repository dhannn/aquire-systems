import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const record = sequelize.define('record', {
    recordType: {
        type: DataTypes.CHAR,
        primarykey: true,
    },
    recordName: {
        type: DataTypes.STRING,
    }
});