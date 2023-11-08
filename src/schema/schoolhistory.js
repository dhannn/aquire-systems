import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';
import { Student } from './student.js';
import { Enrolls } from './enrolls.js';

export const SchoolHistory = sequelize.define('schoolhistory', {
    studentId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Student,
            key: 'studentId', 
        }
    },
    enteredFrom: {
        type: DataTypes.STRING,
    },
    gradeLevelEntered: {
        type: DataTypes.STRING,
        allowNull: false
    },
    schoolYearAdmitted: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Enrolls,
            key: 'schoolYear',
        }
    },
    otherSchoolName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    otherSchoolGradeLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otherSchoolSY: {
        type: DataTypes.STRING,
        allowNull: true
    }
})