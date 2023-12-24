

import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../DBConnection.js';


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

Enrolls.enroll = async function(student, enrollment, transaction) {
    const { schoolYear, grade, section } = enrollment;

    await student.createEnroll({
        student_id: student.student_id,
        schoolYear: schoolYear,
        grade: grade,
        section: section,
    }, { transaction: transaction });
}

Enrolls.hasEnrolled = async function (student, enrollment) {
    const { schoolYear } = enrollment;
    const record = await Enrolls.findOne({
        where: {
            student_id: student.student_id,
            schoolYear: schoolYear
        }
    });
    return record != null;
}
