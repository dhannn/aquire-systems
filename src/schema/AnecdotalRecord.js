
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
        allowNull: false,
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
        type: DataTypes.STRING, 
        allowNull: true, 
        defaultValue: '' 
    },
});

// Define relationships if needed (e.g., linking AnecdotalRecord with Student)
AnecdotalRecord.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id',
});
