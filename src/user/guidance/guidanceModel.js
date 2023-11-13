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
                console.log('Records have been successfully ');
            }).catch(error => {
                console.error('Error adding records:', error);
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
         function addStudentRecord() {
            try{
                if(recordType === undefined){
                    throw new Error('No unique record types selected');
                }
                const year =  Enrolls.findOne({
                    where: {student_id: id},
                    attributes: ['schoolYear']
                });
                const existingRecords = AdmissionRecord.findAll({
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
                const record = AdmissionRecord.bulkCreate(newRecords);
                console.log('Record inserted successfully', record);
                return {record: record}
            } catch(error) {
                console.error('Error inserting record', error);
                return error;
            }
        }
        addStudentRecord();
    }

    /**
     * Adds school history of a student
     * @param {String} id 
     * @param {String} enteredFrom 
     * @param {String} gradeLevelEntered 
     * @param {String} schoolYearAdmitted 
     * @param {String} otherSchoolsAttended 
     */
    static addStudentSchoolHistory(id, enteredFrom, gradeLevelEntered, schoolYearAdmitted, otherSchoolsAttended) {
        async function addStudentSchoolHistory() {
            try{
                const newStudentSchoolHistory = await SchoolHistory.create({
                    student_id: id,
                    enteredFrom: enteredFrom,
                    gradeLevelEntered: gradeLevelEntered,
                    schoolYearAdmitted: schoolYearAdmitted,
                    otherSchoolsAttended: otherSchoolsAttended
                })
                console.log('Student school history successfully created', newStudentSchoolHistory);
            } catch (error) {
                console.error('Error creating student school history', error);
            }
        }
        addStudentSchoolHistory();
    }
}