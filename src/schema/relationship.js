import { Student } from './student.js';
import { Enrolls } from './enrolls.js';
import { Record } from './record.js';
import { AdmissionRecord } from './admissionrecord.js';
import { SchoolHistory } from './schoolhistory.js';

Student.hasMany(Enrolls, {
    foreignKey: 'student_id',
    sourceKey: 'student_id',
    onDelete: 'CASCADE',
});

Enrolls.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id'
});

AdmissionRecord.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id'
});

AdmissionRecord.belongsTo(Enrolls, {
    foreignKey: 'schoolYear',
    targetKey: 'schoolYear'
});

AdmissionRecord.belongsTo(Record, {
    foreignKey: 'recordId', 
    targetKey: 'recordId'});

Record.hasMany(GuidanceInfo, {foreignKey:'recordId'});

AdmissionRecord.hasMany(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id'
});

AdmissionRecord.hasMany(Enrolls, {
    foreignKey: 'schoolYear',
    targetKey: 'schoolYear'
});

SchoolHistory.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id'
});

