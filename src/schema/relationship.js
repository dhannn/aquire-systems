import { Student } from './student.js';
import { Enrolls } from './enrolls.js';
import { Record } from './record.js';
import { AdmissionRecord } from './admissionrecord.js';

Student.hasMany(Enrolls, {
    foreignKey: 'studentID',
    sourceKey: 'student_id',
    onDelete: 'CASCADE',
});

Enrolls.belongsTo(Student, {
    foreignKey: 'studentID',
    targetKey: 'student_id'
});

AdmissionRecord.belongsTo(Student, {
    foreignKey: 'studentId',
    targetKey: 'student_id'
});

AdmissionRecord.belongsTo(Enrolls, {
    foreignKey: 'schoolYear',
    targetKey: 'schoolYear'
})

AdmissionRecord.belongsTo(Record, {
    foreignKey: 'recordId', 
    targetKey: 'recordId'});

Record.hasMany(GuidanceInfo, {foreignKey:'recordId'});

AdmissionRecord.hasMany(Student, {
    foreignKey: 'studentId',
    targetKey: 'student_id'
})

AdmissionRecord.hasMany(Enrolls, {
    foreignKey: 'schoolYear',
    targetKey: 'schoolYear'
})