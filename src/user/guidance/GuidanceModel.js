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
        async function addStudentRecord() {
            try{
                Enrolls.findOne({
                    where: {
                        student_id: id
                    },
                    include: [
                        {
                            model: Enrolls,
                            as: 'schoolYear',
                            attributes:['schoolYear']
                        }
                    ]
                }).then(record => {
                    if(record) {
                        const schoolYear = record.schoolYear.schoolYear;
                        console.log('School Year found', schoolYear);
                    } else {
                        console.log('School Year not found');
                    }
                }).catch(error => {
                    console.error('Error retrieving School Year', error);
                });
                const newRecords = recordType.map(type => ({
                    student_id: id,
                    schoolYear: schoolYear,
                    recordId: type
                }));
                const record = await AdmissionRecord.bulkCreate(newRecords);
                console.log('Record inserted successfully', record);
            } catch(error) {
                console.error('Error inserting record', error);
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