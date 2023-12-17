import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../DBConnection.js';
import { Student } from './student.js';
import { Enrolls } from './enrolls.js';
export const SchoolHistory = sequelize.define('schoolhistory', {
    student_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Student,
            key: 'student_id',
        }
    },
    enteredFrom: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gradeLevelEntered: {
        type: DataTypes.STRING,
        allowNull: true
    },
    schoolYearAdmitted: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otherSchoolsAttended: {
        type: DataTypes.STRING,
        allowNull: true
    }
});
