
import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';
import {Enrolls} from './enrolls.js'


export const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    middleInitial:{
        type: DataTypes.CHAR,
    },
    lastName:{
        allowNull: false,
        type: DataTypes.STRING,
    }

});


