import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { Record } from "../../schema/record.js";
import { Enrolls } from "../../schema/enrolls.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { FamilyData } from "../../schema/familydata.js";
import { SchoolActivity } from "../../schema/schoolactivity.js";

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
                console.log('Error inserting records', error);
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
                const existingSchoolHistory = await SchoolHistory.findOne({student_id: id});
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

        static updateStudentFamilyData(id, studentName, studentBirthday, studentCitizenship, studentAddress_TelOrCpNum, studentOccupation,
                                        fatherName, fatherBirthday, fatherCitizenship, fatherAddress_TelOrCpNum, fatherOccupation, 
                                        motherName, motherBirthday, motherCitizenship, motherAddress_TelOrCpNum, motherOccupation,
                                        guardianName, guardianBirthday, guardianCitizenship, guardianAddress_TelOrCpNum, guardianOccupation,
                                        totalNumberOfChildren, rankInTheFamily, languageSpokenAtHome, religion, martialStatusofParents) {
            async function updateStudentFamilyData() {
                try {
                    const existingFamilyData = await FamilyData.findOne(
                        {
                            where: { student_id: id
                            }
                        });
                    if(existingFamilyData){
                        const familyData = await FamilyData.update({
                            studentName: studentName,
                            studentBirthday: studentBirthday,
                            studentCitizenship: studentCitizenship,
                            studentAddress_TelOrCpNum: studentAddress_TelOrCpNum,
                            studentOccupation: studentOccupation,
                            fatherName: fatherName,
                            fatherBirthday: fatherBirthday,
                            fatherCitizenship: fatherCitizenship,
                            fatherAddress_TelOrCpNum: fatherAddress_TelOrCpNum,
                            fatherOccupation: fatherOccupation,
                            motherName: motherName,
                            motherBirthday: motherBirthday,
                            motherCitizenship: motherCitizenship,
                            motherAddress_TelOrCpNum: motherAddress_TelOrCpNum,
                            motherOccupation: motherOccupation,
                            guardianName: guardianName,
                            guardianBirthday: guardianBirthday,
                            guardianCitizenship: guardianCitizenship,
                            guardianAddress_TelOrCpNum: guardianAddress_TelOrCpNum,
                            guardianOccupation: guardianOccupation,
                            totalNumberOfChildren: totalNumberOfChildren,
                            rankInTheFamily: rankInTheFamily,
                            languageSpokenAtHome: languageSpokenAtHome,
                            religion: religion,
                            martialStatusofParents: martialStatusofParents,
                        }, {
                            where: {
                                student_id: id
                            }
                        });
                        console.log('Student family data successfully updated', familyData);
                        return{familyData: familyData};
                    } else {
                        const familyData = await FamilyData.create({
                            student_id: id,
                            studentName: studentName,
                            studentBirthday: studentBirthday,
                            studentCitizenship: studentCitizenship,
                            studentAddress_TelOrCpNum: studentAddress_TelOrCpNum,
                            studentOccupation: studentOccupation,
                            fatherName: fatherName,
                            fatherBirthday: fatherBirthday,
                            fatherCitizenship: fatherCitizenship,
                            fatherAddress_TelOrCpNum: fatherAddress_TelOrCpNum,
                            fatherOccupation: fatherOccupation,
                            motherName: motherName,
                            motherBirthday: motherBirthday,
                            motherCitizenship: motherCitizenship,
                            motherAddress_TelOrCpNum: motherAddress_TelOrCpNum,
                            motherOccupation: motherOccupation,
                            guardianName: guardianName,
                            guardianBirthday: guardianBirthday,
                            guardianCitizenship: guardianCitizenship,
                            guardianAddress_TelOrCpNum: guardianAddress_TelOrCpNum,
                            guardianOccupation: guardianOccupation,
                            totalNumberOfChildren: totalNumberOfChildren,
                            rankInTheFamily: rankInTheFamily,
                            languageSpokenAtHome: languageSpokenAtHome,
                            religion: religion,
                            martialStatusofParents: martialStatusofParents,

                        });
                        console.log('Student family data successfully added', familyData);
                        return{familyData: familyData};
                    }
                } catch (error) {
                    console.log('Error updating/creating student family data', error);
                    return{error: error};
                }
            }
            return updateStudentFamilyData();
        }

        static updateStudentSchoolActivities(id, gradeLevel, schoolYear, clubName, clubParticipation){
            async function updateStudentSchoolActivities(){
                try{
                    const existingSchoolActivity = await SchoolActivity.findOne({where: {
                        student_id: id,
                        grade: gradeLevel
                    }});
                    if(existingSchoolActivity){
                        const studentSchoolActivity = await SchoolActivity.update({
                            student_id: id,
                            grade: gradeLevel,
                            schoolYear: schoolYear,
                            clubName: clubName,
                            clubParticipation: clubParticipation,
                        },{
                            where: {
                                student_id: id,
                                grade: gradeLevel
                            }
                        });
                        console.log('School activity successfully updated: ', studentSchoolActivity);
                        return {schoolActivity: studentSchoolActivity};
                    } else {
                        const studentSchoolActivity = await SchoolActivity.create({
                            student_id: id,
                            grade: gradeLevel,
                            schoolYear: schoolYear,
                            clubName: clubName,
                            clubParticipation: clubParticipation,
                        });
                        console.log('School activity successfully added: ', studentSchoolActivity);
                        return {schoolActivity: studentSchoolActivity};
                    }
                } catch (error) {
                    console.log('Error updating School Activity: ', error);
                    return {error: error};
                }
            }
            return updateStudentSchoolActivities();
        }
}