import { AdmissionRecord } from "../../schema/admissionrecord.js";
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
        this.createRoute('GET', '/history', this.viewStudentSchoolHistory);
        this.createRoute('POST', '/history', this.addStudentSchoolHistory);
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
            if(result.error){
                res.render('Guidance', {message: {content: 'Error adding Record'}, studentRecords: studentRecords});
            } else {
                res.render('Guidance', {message: { isSuccess: true, content: 'Record added successfully!'}, studentRecords: studentRecords});
                console.log('Record Added');
            }
        } catch (error) {
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

    async viewStudentSchoolHistory(_, res) {
        GuidanceModel.initializeRecordTypes();
        const allowed = await UserController.verifyUserPermission(this.allowedUserType, req)
        const loggedIn = UserController.checkifloggedIn(req);
        if (loggedIn) {
            if (allowed) {
                res.render('Guidance');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }  
    }


    async addStudentSchoolHistory(req, res) {
        try {
            const newSchoolHistory = await GuidanceModel.addStudentSchoolHistory(req.body.student_id, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
            res.render('Guidance', {message: { isSuccess: true, content: 'School History added successfully!'}});
            console.log('School History Added');
        } catch (error) {
            res.render('Guidance', {message: {content: error.message}});
        }
    }

    /**
     * Updates the checklist of student records whenever a Student ID is entered in the textbox
     * @param {Request} req 
     * @param {Response} res 
     */
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
}