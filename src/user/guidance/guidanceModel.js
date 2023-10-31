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
                {recordType:'MC', recordName:'Medical Certificate'},
                {recordType:'RF', recordName:'Recommendation Form'},
                {recordType:'SRF', recordName:'Scholastic Record Form'},
                {recordType:'BEF', recordName:'Basic Education Form'},
                {recordType:'SHSF', recordName:'Senior High School Form'},
                {recordType:'IS', recordName:'Information Sheet'},
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
                const record = await Record.create({
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