import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const AbilityIntelligenceTest = sequelize.define('abilityintelligencetest', {
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
    testType: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    currentDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    currentGradeLevel: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateAdministered: {
        type: DataTypes.DATE,
        allownull: true
    },
    testAdministered: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rawScore: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ca: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    iq_sai: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    percentile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stanine: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});