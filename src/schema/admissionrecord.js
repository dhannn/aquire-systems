import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';
import { Record } from './record.js';
import { Student } from './student.js';
import { Enrolls } from './enrolls.js';

export const AdmissionRecord = sequelize.define('admissionRecord', {
    student_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Student,
            key: 'student_id', 
        }
    },
    schoolYear: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Enrolls,
            key: 'schoolYear',
        }
    },
    recordId: {
        type: DataTypes.CHAR,
        references: {
            model: Record,
            key: 'recordType',
        }
    }
});