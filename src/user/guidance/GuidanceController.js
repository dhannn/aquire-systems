import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { UserController } from "../UserController.js";
import { GuidanceModel } from "./GuidanceModel.js";
import { FamilyData } from "../../schema/familydata.js";
import { SchoolActivity } from "../../schema/schoolactivity.js";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';
    allowedUserType = 'G';

    initializeRoutes() {

        this.createRoute('GET', '/', this.viewGuidancePage);
        this.createRoute('POST', '/', this.getStudentRecords);
        this.createRoute('GET', '/records', this.viewGuidancePage)
        this.createRoute('POST', '/records', this.addStudentRecord);
        this.createRoute('GET', '/cummulative', this.viewGuidancePage);
        this.createRoute('POST', '/cummulative', this.updateStudentCummulativeRecord);
        this.createRoute('POST', '/cummulative-get', this.getStudentCummulativeRecord);

    }

    /**
     * uses Admin model to add student records into the database
     * @param {Request} req 
     * @param {Response} res 
     */
    async addStudentRecord(req, res) {
        try {
            const {student_id, recordTypes} = req.body;
            console.log(recordTypes);
            const result = await GuidanceModel.addStudentRecord(student_id, recordTypes);
            const studentRecords = await GuidanceModel.StudentRecords();
            if(result.error){
                res.render('Guidance', {message: {content: 'Error adding Record'}, studentRecords: studentRecords});
            } else {
                res.render('Guidance', {message: { isSuccess: true, content: 'Student Record added successfully!'}, studentRecords: studentRecords});
                console.log('Record Added');
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: 'Error adding Record'}, studentRecords: studentRecords});
        }
    }

    /**
     * Creates the view for the guidance student records and initializes all record types
     * @param {Request} _ 
     * @param {Response} res 
     */
    async viewGuidancePage(_, res) {
        GuidanceModel.initializeRecordTypes();
        const allowed = await UserController.verifyUserPermission(this.allowedUserType, _)
        const loggedIn = UserController.checkifloggedIn(_);

        const studentRecords = await GuidanceModel.StudentRecords();
        if (loggedIn) {
            if (allowed) {
                res.render('Guidance', {studentRecords: studentRecords});
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }  
    }

    async getStudentRecords(req, res) {
        const studentId = req.body.textData;
        try {
            // Query the database to find records for the student
            const records = await AdmissionRecord.findAll({
                where: { student_id: studentId },
                attributes: ['recordId']
            });
    
            // Convert to a format suitable for the frontend to process
            const recordIds = records.map(r => r.recordId);
            res.json({ recordIds });
        } catch (error) {
            console.error('Error fetching student records:', error);
            res.status(500).send('Error processing request');
        }
    }

    async updateStudentCummulativeRecord(req, res) {
        try{
            console.log(req.body);
            const schoolHistoryError = await this.updateStudentSchoolHistory(req, res);
            const familyDataError = await this.updateStudentFamilyData(req, res);
            const studentRecords = await GuidanceModel.StudentRecords();
            if(schoolHistoryError.error || familyDataError.error){
                res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords});
            } else{
                res.render('Guidance', {message: {isSuccess: true, content: 'Student Cummulative Record updated!'}, studentRecords: studentRecords})
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords})
        }
    }

    async updateStudentSchoolHistory(req, res) {
        try {
            const newSchoolHistory = await GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
            if(newSchoolHistory.error){
                return {error: newSchoolHistory.error};
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: error.message}, studentRecords: studentRecords});
        }
    }

    async getStudentCummulativeRecord(req, res){
        try {
            const cummulativeRecord = {
                schoolHistory: await this.getStudentSchoolHistory(req, res),
                familyData: await this.getStudentFamilyData(req, res)
            }
            res.json(cummulativeRecord);
        } catch (error) {

        }
    }

    async getStudentSchoolHistory(req, res) {
        const studentId = req.body.textData;
        try {
            
            const schoolHistory = await SchoolHistory.findOne({
                where: {student_id: studentId}
            });

            if(schoolHistory){
                const formattedSchoolHistory = {
                    enteredFrom: schoolHistory.enteredFrom,
                    gradeLevelEntered: schoolHistory.gradeLevelEntered,
                    schoolYearAdmitted: schoolHistory.schoolYearAdmitted,
                    otherSchoolsAttended: schoolHistory.otherSchoolsAttended
                }
                console.log('Successfully fetched student school history: ', schoolHistory);
                return formattedSchoolHistory;
            } else {
                const formattedSchoolHistory = {
                    enteredFrom: '',
                    gradeLevelEntered: '',
                    schoolYearAdmitted: '',
                    otherSchoolsAttended: ''
                }
                console.log('Student School history not found');
                return formattedSchoolHistory;
            }
        } catch(error) {
            console.error('Error fetching school history: ', error);
            res.status(500).send('Error processing request');
        }
    }

    async updateStudentFamilyData(req, res) {
        try{
            const newFamilyData = await GuidanceModel.updateStudentFamilyData(req.body.student_id, req.body.student_name, req.body.student_birthday, req.body.student_citizenship,
                                                                                req.body.student_address, req.body.student_occupation, req.body.father_name, req.body.father_birthday, 
                                                                                req.body.father_citizenship, req.body.father_address, req.body.father_occupation, req.body.mother_name,
                                                                                req.body.mother_birthday, req.body.mother_citizenship, req.body.mother_address, req.body.mother_occupation,
                                                                                req.body.guardian_name, req.body.guardian_birthday, req.body.guardian_citizenship, req.body.guardian_address,
                                                                                req.body.guardian_occupation, req.body.totalChildren, req.body.rankFamily, req.body.spokenLanguage,
                                                                                req.body.religion, req.body.parentStatus);
            if(newFamilyData.error){
                return {error: newFamilyData.error};
            }
        } catch (error) {
            console.log('Error updating/creating student family data', error);
        }
    }
    async getStudentFamilyData(req, res){
        const studentId = req.body.textData;
        try{
            const familyData = await FamilyData.findOne({
                where: {student_id: studentId}
            });
            if(familyData){
                const formattedFamilyData = {
                            studentName: familyData.studentName,
                            studentBirthday: familyData.studentBirthday,
                            studentCitizenship: familyData.studentCitizenship,
                            studentAddress_TelOrCpNum: familyData.studentAddress_TelOrCpNum,
                            studentOccupation: familyData.studentOccupation,
                            fatherName: familyData.fatherName,
                            fatherBirthday: familyData.fatherBirthday,
                            fatherCitizenship: familyData.fatherCitizenship,
                            fatherAddress_TelOrCpNum: familyData.fatherAddress_TelOrCpNum,
                            fatherOccupation: familyData.fatherOccupation,
                            motherName: familyData.motherName,
                            motherBirthday: familyData.motherBirthday,
                            motherCitizenship: familyData.motherCitizenship,
                            motherAddress_TelOrCpNum: familyData.motherAddress_TelOrCpNum,
                            motherOccupation: familyData.motherOccupation,
                            guardianName: familyData.guardianName,
                            guardianBirthday: familyData.guardianBirthday,
                            guardianCitizenship: familyData.guardianCitizenship,
                            guardianAddress_TelOrCpNum: familyData.guardianAddress_TelOrCpNum,
                            guardianOccupation: familyData.guardianOccupation,
                            totalNumberOfChildren: familyData.totalNumberOfChildren,
                            rankInTheFamily: familyData.rankInTheFamily,
                            languageSpokenAtHome: familyData.languageSpokenAtHome,
                            religion: familyData.religion,
                            martialStatusofParents: familyData.martialStatusofParents,
                }
                console.log('succesfully fetched student family data: ', formattedFamilyData);
                return formattedFamilyData;
            } else {
                console.log('student family data not found');
            }
        } catch (error) {
            console.log('error fetching student family data', error);
            res.status(500).send('Error processing request');
        }
    }
}