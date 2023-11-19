import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const HealthRecord = sequelize.define('healthrecord', {
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
    vision: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    height: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    specialCondition: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});