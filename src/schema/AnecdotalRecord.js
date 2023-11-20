
import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';
import { Student } from './student.js';
import { Enrolls } from './enrolls.js';

export const AnecdotalRecord = sequelize.define('AnecdotalRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    student_id: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: Student,
            key: 'student_id',
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    anecdotalRecord: {
        type: DataTypes.STRING, // or any other data type
        allowNull: true, // Allow null values
        defaultValue: '' // Set a default value
    },
});

// Define relationships if needed (e.g., linking AnecdotalRecord with Student)
AnecdotalRecord.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id',
});
