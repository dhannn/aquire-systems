var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { Record } from "../../schema/record.js";
import { Enrolls } from "../../schema/enrolls.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { AnecdotalRecord } from "../../schema/AnecdotalRecord.js";
import { Student } from "../../schema/student.js";
export class GuidanceModel {
    /**
     * Initializes the record types
     */
    static initializeRecordTypes() {
        function initializeTypes() {
            return __awaiter(this, void 0, void 0, function* () {
                const record = [
                    { recordId: 'MC', recordName: 'Medical Certificate' },
                    { recordId: 'RF', recordName: 'Recommendation Form' },
                    { recordId: 'SRF', recordName: 'Scholastic Record Form' },
                    { recordId: 'BEF', recordName: 'Basic Education Form' },
                    { recordId: 'SHSF', recordName: 'Senior High School Form' },
                    { recordId: 'IS', recordName: 'Information Sheet' },
                ];
                Record.bulkCreate(record, {
                    updateOnDuplicate: ['recordName']
                }).then(() => {
                    console.log('Records have been successfully records');
                }).catch(error => {
                    console.error('Error initializing records:', error);
                });
            });
        }
        initializeTypes();
    }
    /**
     * adds a record for a student.
     * @param {String} id
     * @param {String} recordType
     */
    static addStudentRecord(id, recordType) {
        function addStudentRecord() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const year = yield Enrolls.findOne({
                        where: { student_id: id },
                        attributes: ['schoolYear']
                    });
                    const existingRecords = yield AdmissionRecord.findAll({
                        where: { student_id: id },
                        attributes: ['recordId']
                    });
                    const existingRecordIds = existingRecords.map(record => record.recordId);
                    const uniqueRecordIds = recordType.filter(id => !existingRecordIds.includes(id));
                    if (uniqueRecordIds.length == 0) {
                        throw new Error('No unique record types selected');
                    }
                    const newRecords = uniqueRecordIds.map(type => ({
                        student_id: id,
                        schoolYear: year.schoolYear.toString(),
                        recordId: type
                    }));
                    const record = yield AdmissionRecord.bulkCreate(newRecords);
                    console.log('Record inserted successfully', record);
                    return { record: record };
                }
                catch (error) {
                    console.log('Error in Model', error);
                    return { error: error };
                }
            });
        }
        return addStudentRecord();
    }
    /**

     * updates school history of a student
     * @param {String} id
     * @param {String} enteredFrom
     * @param {String} gradeLevelEntered
     * @param {String} schoolYearAdmitted
     * @param {String} otherSchoolsAttended
     */
    static updateStudentSchoolHistory(id, enteredFrom, gradeLevelEntered, schoolYearAdmitted, otherSchoolsAttended) {
        function addStudentSchoolHistory() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const existingSchoolHistory = yield SchoolHistory.findOne({
                        where: { student_id: id }
                    });
                    if (existingSchoolHistory) {
                        const schoolHistory = yield SchoolHistory.update({
                            enteredFrom: enteredFrom,
                            gradeLevelEntered: gradeLevelEntered,
                            schoolYearAdmitted: schoolYearAdmitted,
                            otherSchoolsAttended: otherSchoolsAttended
                        }, {
                            where: {
                                student_id: id
                            }
                        });
                        console.log('School History updated Successfully', schoolHistory);
                        return { schoolHistory: schoolHistory };
                    }
                    else {
                        const newStudentSchoolHistory = yield SchoolHistory.create({
                            student_id: id,
                            enteredFrom: enteredFrom,
                            gradeLevelEntered: gradeLevelEntered,
                            schoolYearAdmitted: schoolYearAdmitted,
                            otherSchoolsAttended: otherSchoolsAttended
                        });
                        console.log('School History added Successfully', newStudentSchoolHistory);
                        return { schoolHistory: newStudentSchoolHistory };
                    }
                }
                catch (error) {
                    console.error('Error creating student school history', error);
                    return { error: error };
                }
            });
        }
        return addStudentSchoolHistory();
    }
    static StudentRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            const studentRecords = yield AdmissionRecord.findAll({
                attributes: ['student_id', 'recordId'],
                order: [['student_id', 'ASC']],
                raw: true
            });
            for (let i = 0; i < studentRecords.length; i++) {
                if (studentRecords[i].recordId == 'MC') {
                    studentRecords[i].recordId = 'Medical Cerificate';
                }
                else if (studentRecords[i].recordId == 'RF') {
                    studentRecords[i].recordId = 'Recommendation Form';
                }
                else if (studentRecords[i].recordId == 'SRF') {
                    studentRecords[i].recordId = 'Scholastic Record Form';
                }
                else if (studentRecords[i].recordId == 'BEF') {
                    studentRecords[i].recordId = 'Basic Education Form';
                }
                else if (studentRecords[i].recordId == 'SHSF') {
                    studentRecords[i].recordId = 'Senior High Shool Form';
                }
                else if (studentRecords[i].recordId == 'IS') {
                    studentRecords[i].recordId = 'Information Sheet';
                }
                else {
                    console.log('Database error: Record Id does not exist');
                }
            }
            let records = {};
            studentRecords.forEach((record) => __awaiter(this, void 0, void 0, function* () {
                const student = record.student_id;
                if (!records[student]) {
                    records[student] = {
                        has: [],
                        firstName: '',
                        lastName: ''
                    };
                    const studentInfo = yield Student.findByPk(student, {
                        attributes: ['firstName', 'lastName'],
                        raw: true
                    });
                    records[student].firstName = studentInfo.firstName;
                    records[student].lastName = studentInfo.lastName;
                }
                records[student].has.push(record.recordId);
            }));
            return records;
        });
    }
    static fetchAnecdotalRecords(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const anecdotalRecords = yield AnecdotalRecord.findAll({
                    where: {
                        student_id: studentId
                    },
                    order: [
                        ['date', 'DESC']
                    ],
                    raw: true
                });
                anecdotalRecords.forEach(record => {
                    const current = record.date;
                    record.date = `${current.getMonth() + 1}/${current.getDate()}/${current.getFullYear()}`;
                });
                return anecdotalRecords;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static addAnecdotalRecord(student_id, date, anecdotalRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Received Student ID:', student_id);
                if (!student_id) {
                    console.error('Student ID is empty or undefined');
                    return { error: 'Student ID is empty or undefined' };
                }
                // Check if the student_id exists in the Student table
                const existingStudent = yield Student.findOne({ where: { student_id } });
                console.log('Existing Student:', existingStudent);
                if (!existingStudent) {
                    // Handle case where the student_id doesn't exist
                    console.error('Student ID does not exist');
                    return { error: 'Student ID does not exist' };
                }
                console.log('Received Date:', date);
                const newAnecdotalRecord = yield AnecdotalRecord.create({
                    student_id,
                    date: date,
                    anecdotalRecord
                });
                console.log('Anecdotal Record inserted successfully', newAnecdotalRecord);
                return { success: true };
            }
            catch (error) {
                console.error('Error adding Anecdotal Record:', error);
                return { error: error.message };
            }
        });
    }
}
