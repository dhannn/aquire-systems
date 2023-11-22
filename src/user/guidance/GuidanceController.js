import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { HealthRecord } from "../../schema/healthrecord.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { UserController } from "../UserController.js";
import { GuidanceModel } from "./GuidanceModel.js";

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
            //this.updateStudentSchoolHistory(req, res);
            this.updateStudentHealthRecord(req, res);
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {isSuccess: true, content: 'Student Cummulative Record updated!'}, studentRecords: studentRecords})
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords})
        }
    }

    async updateStudentSchoolHistory(req, res) {
        try {
            const newSchoolHistory = await GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: error.message}, studentRecords: studentRecords});
        }
    }

    async updateStudentHealthRecord(req, res){
        try{
            const healthRecordGrade7 = await GuidanceModel.updateStudentHealthRecord(req.body.student_id, req.body.healthRecordGrade7, req.body.grade7Vision, req.body.grade7Height, req.body.grade7Weight, req.body.grade7SpecialCondition);
            const healthRecordGrade8 = await GuidanceModel.updateStudentHealthRecord(req.body.student_id, req.body.healthRecordGrade8, req.body.grade8Vision, req.body.grade8Height, req.body.grade8Weight, req.body.grade8SpecialCondition);
            const healthRecordGrade9 = await GuidanceModel.updateStudentHealthRecord(req.body.student_id, req.body.healthRecordGrade9, req.body.grade9Vision, req.body.grade9Height, req.body.grade9Weight, req.body.grade9SpecialCondition);
            const healthRecordGrade10 = await GuidanceModel.updateStudentHealthRecord(req.body.student_id, req.body.healthRecordGrade10, req.body.grade10Vision, req.body.grade10Height, req.body.grade10Weight, req.body.grade10SpecialCondition);
            const healthRecordGrade11 = await GuidanceModel.updateStudentHealthRecord(req.body.student_id, req.body.healthRecordGrade11, req.body.grade11Vision, req.body.grade11Height, req.body.grade11Weight, req.body.grade11SpecialCondition);
            const healthRecordGrade12 = await GuidanceModel.updateStudentHealthRecord(req.body.student_id, req.body.healthRecordGrade12, req.body.grade12Vision, req.body.grade12Height, req.body.grade12Weight, req.body.grade12SpecialCondition);
        } catch (error) {

        }
    }

    async getStudentCummulativeRecord(req, res){
        try {
            const cummulativeRecord = {
                schoolHistory: await this.getStudentSchoolHistory(req, res),
                healthRecord: await this.getStudentHealthRecord(req, res)
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

    async getStudentHealthRecord(req, res) {
        const studentId = req.body.textData;

        const healthRecord = await HealthRecord.findAll({
            where: {student_id: studentId}
        });
        if(healthRecord) {
            const formattedHealthRecord = healthRecord.map(record => record.dataValues);
            console.log(formattedHealthRecord);
            return formattedHealthRecord;
        } else {
            console.log('Student Health Record not found');
        }
    }
}