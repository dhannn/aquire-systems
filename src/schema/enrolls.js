

import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';
import {Student} from './student.js'


export const Enrolls = sequelize.define('Enrolls', {
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
        primaryKey: true,
    },
    grade: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

