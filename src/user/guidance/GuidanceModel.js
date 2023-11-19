import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { Record } from "../../schema/record.js";
import { Enrolls } from "../../schema/enrolls.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";

export class GuidanceModel {
    
    /**
     * Initializes the record types
     */
    static initializeRecordTypes(){
        async function initializeTypes() {
            const record = [
                {recordId:'MC', recordName:'Medical Certificate'},
                {recordId:'RF', recordName:'Recommendation Form'},
                {recordId:'SRF', recordName:'Scholastic Record Form'},
                {recordId:'BEF', recordName:'Basic Education Form'},
                {recordId:'SHSF', recordName:'Senior High School Form'},
                {recordId:'IS', recordName:'Information Sheet'},
            ];

            Record.bulkCreate(record, {
                updateOnDuplicate: ['recordName']
            }).then(() => {
                console.log('Records have been successfully records');
            }).catch(error => {
                console.error('Error initializing records:', error);
            });
        }
        initializeTypes();
    }

    /**
     * adds a record for a student.
     * @param {String} id 
     * @param {String} recordType 
     */
    static addStudentRecord(id, recordType){
        async function addStudentRecord() {
            try{
                const year = await Enrolls.findOne({
                    where: {student_id: id},
                    attributes: ['schoolYear']
                });
                const existingRecords = await AdmissionRecord.findAll({
                    where: {student_id: id},
                    attributes: ['recordId']
                });
                const existingRecordIds = existingRecords.map(record => record.recordId);
                const uniqueRecordIds = recordType.filter(id => !existingRecordIds.includes(id));
                 if(uniqueRecordIds.length == 0) {
                     throw new Error('No unique record types selected');
                 }
                const newRecords = uniqueRecordIds.map(type => ({
                    student_id: id,
                    schoolYear: year.schoolYear.toString(),
                    recordId: type
                }));
                const record = await AdmissionRecord.bulkCreate(newRecords);
                console.log('Record inserted successfully', record);
                return {record: record};
            } catch(error) {
                console.log('Error in Model', error);
                return {error: error};
            }
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
        async function addStudentSchoolHistory() {
            try{
                const existingSchoolHistory = await SchoolHistory.findOne({
                    where: {student_id: id}
                });
                if(existingSchoolHistory) {
                    const schoolHistory = await SchoolHistory.update({
                        enteredFrom: enteredFrom,
                        gradeLevelEntered: gradeLevelEntered,
                        schoolYearAdmitted: schoolYearAdmitted,
                        otherSchoolsAttended: otherSchoolsAttended
                    },{
                        where: {
                            student_id: id
                        }
                    });
                    console.log('School History updated Successfully', schoolHistory);
                    return {schoolHistory: schoolHistory};
                } else {
                    const newStudentSchoolHistory = await SchoolHistory.create({
                        student_id: id,
                        enteredFrom: enteredFrom,
                        gradeLevelEntered: gradeLevelEntered,
                        schoolYearAdmitted: schoolYearAdmitted,
                        otherSchoolsAttended: otherSchoolsAttended
                    })
                    console.log('School History added Successfully', newStudentSchoolHistory);
                    return {schoolHistory: newStudentSchoolHistory};
                }
            } catch (error) {
                console.error('Error creating student school history', error);
                return {error: error};
            }
        }
        return addStudentSchoolHistory();
    }

    static async StudentRecords() {
            const studentRecords = await AdmissionRecord.findAll({
                attributes: ['student_id', 'recordId'],
                order: [['student_id', 'ASC']],
                raw: true
            });
            for(let i = 0; i < studentRecords.length; i++){
                if(studentRecords[i].recordId == 'MC') {
                    studentRecords[i].recordId = 'Medical Cerificate';
                } else if(studentRecords[i].recordId == 'RF') {
                    studentRecords[i].recordId = 'Recommendation Form';
                } else if(studentRecords[i].recordId == 'SRF') {
                    studentRecords[i].recordId = 'Scholastic Record Form';
                } else if(studentRecords[i].recordId == 'BEF') {
                    studentRecords[i].recordId = 'Basic Education Form';
                } else if(studentRecords[i].recordId == 'SHSF') {
                    studentRecords[i].recordId ='Senior High Shool Form';
                } else if(studentRecords[i].recordId == 'IS') {
                    studentRecords[i].recordId = 'Information Sheet';
                } else {
                    console.log('Database error: Record Id does not exist');
                }
            }
            return studentRecords;
        }
}