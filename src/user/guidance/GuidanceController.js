import { AdmissionRecord } from "../../schema/admissionrecord.js";
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
            const schoolHistoryError = await this.updateStudentSchoolHistory(req, res);
            const studentRecords = await GuidanceModel.StudentRecords();
            if(schoolHistoryError){
                res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords});
            } else{
                res.render('Guidance', {message: {isSuccess: true, content: 'Student Cummulative Record updated!'}, studentRecords: studentRecords});
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: 'Error updating Cummulative Record'}, studentRecords: studentRecords})
        }
    }

    async updateStudentSchoolHistory(req, res) {
        try {
            const newGradeSchoolHistory = await GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.grade_school_history, req.body.enteredFrom_gs, req.body.gradeLevelEntered_gs, req.body.schoolYearAdmitted_gs, req.body.otherSchoolsAttended_gs);
            const newHighSchoolHistory = await GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.high_school_history, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
            if(newGradeSchoolHistory.error){
                return {error: newGradeSchoolHistory.error};
            } else if(newHighSchoolHistory.error){
                return {error: newHighSchoolHistory.error};
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: error.message}, studentRecords: studentRecords});
        }
    }

    async getStudentCummulativeRecord(req, res){
        const cummulativeRecord = {
            schoolHistory: await this.getStudentSchoolHistory(req, res),
        }
        res.json(cummulativeRecord);
    }

    async getStudentSchoolHistory(req, res) {
        const studentId = req.body.textData;
        const schoolHistory = await SchoolHistory.findAll({
            where: {
                student_id: studentId
            }
        });
        if(schoolHistory){
            const formattedSchoolHistory = schoolHistory.map(record => record.dataValues);
            console.log(formattedSchoolHistory);
            return formattedSchoolHistory;
        }
    }
}