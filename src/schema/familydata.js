import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';

export const FamilyData = sequelize.define('FamilyData', {
    student_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Students',
            key: 'student_id', 
        }
    },
    studentName: {
        type:DataTypes.STRING,
        allowNull: false
    },
    studentBirthday: {
        type:DataTypes.STRING,
        allowNull: false
    },
    studentCitizenship: {
        type:DataTypes.STRING,
        allowNull: false
    },
    studentAddress_TelOrCpNum: {
        type:DataTypes.STRING,
        allowNull: false
    },
    studentOccupation: {
        type:DataTypes.STRING,
        allowNull: false
    },
    fatherName: {
        type:DataTypes.STRING,
        allowNull: true
    },
    fatherBirthday: {
        type:DataTypes.STRING,
        allowNull: true
    },
    fatherCitizenship: {
        type:DataTypes.STRING,
        allowNull: true
    },
    fatherAddress_TelOrCpNum: {
        type:DataTypes.STRING,
        allowNull: true
    },
    fatherOccupation: {
        type:DataTypes.STRING,
        allowNull: true
    },
    motherName: {
        type:DataTypes.STRING,
        allowNull: true
    },
    motherBirthday: {
        type:DataTypes.STRING,
        allowNull: true
    },
    motherCitizenship: {
        type:DataTypes.STRING,
        allowNull: true
    },
    motherAddress_TelOrCpNum: {
        type:DataTypes.STRING,
        allowNull: true
    },
    motherOccupation: {
        type:DataTypes.STRING,
        allowNull: true
    },
    guardianName: {
        type:DataTypes.STRING,
        allowNull: true
    },
    guardianBirthday: {
        type:DataTypes.STRING,
        allowNull: true
    },
    guardianCitizenship: {
        type:DataTypes.STRING,
        allowNull: true
    },
    guardianAddress_TelOrCpNum: {
        type:DataTypes.STRING,
        allowNull: true
    },
    guardianOccupation: {
        type:DataTypes.STRING,
        allowNull: true
    },
    totalNumberOfChildren: {
        type:DataTypes.INTEGER,
        allowNull: true
    },
    rankInTheFamily: {
        type:DataTypes.INTEGER,
        allowNull: true
    },
    languageSpokenAtHome: {
        type:DataTypes.STRING,
        allowNull: true
    },
    religion: {
        type:DataTypes.STRING,
        allowNull: true
    },
    martialStatusofParents: {
        type:DataTypes.STRING,
        allowNull: true
    },
});