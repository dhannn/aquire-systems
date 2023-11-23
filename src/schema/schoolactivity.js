import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const SchoolActivity = sequelize.define('schoolactivity', {
    student_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Students',
            key: 'student_id', 
        }
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    schoolYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clubName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    clubParticipation: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});