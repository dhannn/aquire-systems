var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { User } from "../../schema/user.js";
import { Student } from "../../schema/student.js";
import { Enrolls } from "../../schema/enrolls.js";
import { CurrentSchoolYear } from "../../schema/currentschoolyear.js";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../DBConnection.js";
export class AdminModel {
    /**
     * Inserts the user to the database
     * @param {string} username
     * @param {string} password
     * @param {string} type
     */
    addUser(username, password, type) {
        let promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            const hashedPassword = yield bcrypt.hash(password, saltRounds);
            const uuid = uuidv4();
            User.create({
                userId: uuid,
                userName: username,
                userPassword: hashedPassword,
                userType: type,
            }).then((data) => {
                resolve(data);
            }).catch((error) => {
                reject(error);
            });
        }));
        return promise;
    }
    /**
     * Inserts the user to the database
     */
    viewUsers() { }
    /**
     * Inserts the student tow the database
     * @param {string} id
     * @param {string} firstName
     * @param {string} middleName
     * @param {string} lastName
     * @param {int} grade
     * @param {string} section
     */
    addStudent(id, firstName, middleName, lastName, grade, section) {
        return sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            if (middleName.length > 2) {
                throw new Error("Middle initial should be at most two characters");
            }
            const currentSchoolYear = yield CurrentSchoolYear.findOne({
                order: [['createdAt', 'DESC']],
            });
            if (!currentSchoolYear) {
                throw new Error("Current school year is not set");
            }
            const schoolYear = `${currentSchoolYear.fromYear}-${currentSchoolYear.toYear}`;
            const existingStudent = yield Student.findOne({
                where: { student_id: id },
                transaction: t,
            });
            if (existingStudent) {
                if (existingStudent.firstName === firstName &&
                    existingStudent.middleInitial === middleName &&
                    existingStudent.lastName === lastName) {
                    const alreadyEnrolled = yield Enrolls.findOne({
                        where: {
                            student_id: id,
                            schoolYear: schoolYear,
                        },
                        transaction: t,
                    });
                    if (alreadyEnrolled) {
                        throw new Error("Student is already enrolled for the current school year");
                    }
                    yield Enrolls.create({
                        student_id: id,
                        schoolYear: schoolYear,
                        grade: grade,
                        section: section,
                    }, { transaction: t });
                    console.log("Enrollment added for existing student");
                    return existingStudent;
                }
                else {
                    throw new Error("Student details do not match with existing records");
                }
            }
            try {
                const newStudent = yield Student.create({
                    student_id: id,
                    firstName: firstName,
                    middleInitial: middleName,
                    lastName: lastName,
                }, { transaction: t });
                yield newStudent.createEnroll({
                    student_id: id,
                    schoolYear: schoolYear,
                    grade: grade,
                    section: section,
                }, { transaction: t });
                console.log("Student and enrollment inserted successfully");
                return newStudent;
            }
            catch (error) {
                console.error("Error inserting student and/or enrollment:", error);
                throw error;
            }
        }));
    }
    startNewSchoolYear() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentSchoolYear = yield CurrentSchoolYear.findOne({
                    order: [['createdAt', 'DESC']],
                });
                if (!currentSchoolYear) {
                    throw new Error('Current school year is not set');
                }
                console.log('Starting new school year. Current school year:', currentSchoolYear);
                const fromYear = parseInt(currentSchoolYear.fromYear) + 1;
                const toYear = parseInt(currentSchoolYear.toYear) + 1;
                yield this.updateCurrentSchoolYear(fromYear.toString(), toYear.toString());
                console.log('New school year started successfully.');
                const updatedSchoolYear = yield CurrentSchoolYear.findOne();
                if (!updatedSchoolYear) {
                    throw new Error('Failed to fetch the updated school year');
                }
                return updatedSchoolYear;
            }
            catch (error) {
                console.error('Error starting new school year:', error);
                throw error;
            }
        });
    }
    updateCurrentSchoolYear(fromYear, toYear) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Update the current school year range in the CurrentSchoolYear table
                const [updatedRows] = yield CurrentSchoolYear.update({ fromYear, toYear }, { where: {} });
                if (updatedRows === 0) {
                    throw new Error('Failed to update the current school year');
                }
                return { fromYear, toYear };
            }
            catch (error) {
                console.error('Error updating the current school year:', error);
                throw error;
            }
        });
    }
    updateExistingStudentInfo(id, firstName, middleName, lastName, grade, section) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield Student.update({
                    firstName: firstName,
                    middleInitial: middleName,
                    lastName: lastName,
                }, {
                    where: {
                        student_id: id
                    }
                });
                const enrolls = yield Enrolls.update({
                    grade: grade,
                    section: section,
                }, {
                    where: {
                        student_id: id
                    }
                });
                return { student: student, enrolls: enrolls };
            }
            catch (error) {
                console.error('Error updating student information');
                return { error: error };
            }
        });
    }
}
