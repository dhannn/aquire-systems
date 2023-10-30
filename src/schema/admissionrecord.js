import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const admissionRecord = sequelize.define('admissionRecord', {
    studentId: {
        type: DataTypes.STRING,
        //key: 'studentId' uncomment when connected to database
    }
})