import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';
import { Record } from './record.js';

export const AdmissionRecord = sequelize.define('admissionRecord', {
    studentId: {
        type: DataTypes.STRING,
        /*
        references: {
            model: Student,
            key: 'studentId'
        }
        uncomment when other schemas prepared*/
    },
    schoolYear: {
        type: DataTypes.INTEGER,
        /*
        references: {
            model: Student,
            key: 'schoolYear'
        }
        uncomment when other schemas prepared*/
    },
    recordId: {
        type: DataTypes.CHAR,
        references: {
            model: Record,
            key: 'recordType',
        }
    }
});