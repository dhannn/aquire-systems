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
    schoolYear: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nameOfClub: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    participation: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});