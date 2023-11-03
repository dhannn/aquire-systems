import { Student } from './student.js';
import { Enrolls } from './enrolls.js';

Student.hasMany(Enrolls, {
    foreignKey: 'studentID',
    sourceKey: 'student_id',
    onDelete: 'CASCADE',
});

Enrolls.belongsTo(Student, {
    foreignKey: 'studentID',
    targetKey: 'student_id'
});