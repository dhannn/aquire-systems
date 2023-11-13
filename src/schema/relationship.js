import { Student } from './student.js';
import { Enrolls } from './enrolls.js';

Student.hasMany(Enrolls, {
    foreignKey: 'student_id',
    sourceKey: 'student_id',
    onDelete: 'CASCADE',
});

Enrolls.belongsTo(Student, {
    foreignKey: 'student_id',
    targetKey: 'student_id'
});