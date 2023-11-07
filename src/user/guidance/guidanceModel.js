import { Record } from "../../schema/record";
import { AdmissionRecord } from "../../schema/admissionrecord";
import { Record } from "../../schema/record";
import { Enrolls } from "../../schema/enrolls";

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
                Enrolls.findOne({
                    where: {
                        studentId: id
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
                }).catch(record => {
                    console.error('Error retrieving School Year', error);
                });
                const record = await AdmissionRecord.create({
                    studentId: id,
                    schoolYear: schoolYear,
                    recordId: recordType
                });
                console.log('Record inserted successfully', record);
                return record;
            } catch(error) {
                console.error('Error inserting record', error);
            }
        }
        addStudentRecord();
    }
}