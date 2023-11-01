import { Record } from "../../schema/record";
import { AdmissionRecord } from "../../schema/admissionrecord";
import { Record } from "../../schema/record";

export class GuidanceModel {
    
    /**
     * Initializes the record types
     */
    static initializeRecordTypes(){
        async function initializeTypes() {
            record = [
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

    static addStudentRecord(id, recordType){
        async function addStudentRecord() {
            try{
                const record = await AdmissionRecord.create({
                    studentId: id,
                    schoolYear: 1111,
                    recordId: recordType
                });
                console.log('Record inserted successfully', record);
            } catch(error) {
                console.error('Error inserting record', error);
            }
        }
        addStudentRecord();
    }
}