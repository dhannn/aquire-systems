
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

Student.exists = async function (student) {
    return (await Student.findOne({
        where: { student_id : student.student_id}
    })) != null;
}

Student.prototype.exists = async function () {
    return (await Student.findOne({
        where: { student_id : this.student_id}
    })) != null;
}

Student.prototype.equals = async function(student) {
    return this.firstName === student.firstName &&
    this.middleInitial === student.middleName &&
    this.lastName === student.lastName; 
}

