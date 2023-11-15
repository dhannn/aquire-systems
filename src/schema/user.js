
import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const User = sequelize.define('User', {
    userId: {
        allowNull: false,
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userName: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    userPassword:{
        allowNull: false,
        type: DataTypes.STRING,
    },
    userType:{
        allowNull: false,
        type: DataTypes.CHAR,
    }
});

