import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { UserController } from "../UserController.js";
import { GuidanceModel } from "./GuidanceModel.js";
import { AnecdotalRecord } from "../../schema/AnecdotalRecord.js";
import { Student } from "../../schema/student.js";
import { CurrentSchoolYear } from '../../schema/currentschoolyear.js'
import { Enrolls } from "../../schema/enrolls.js";

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
        this.createRoute('GET', '/cummulative', this.viewGuidancePage);
        this.createRoute('POST', '/cummulative', this.updateStudentSchoolHistory);
        this.createRoute('POST', '/cummulative-get', this.getStudentSchoolHistory);
        this.createRoute('GET', '/anecdotal', this.viewAnecdotalRecords);
        this.createRoute('POST', '/anecdotal', this.addAnecdotalRecord);

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

    async updateStudentSchoolHistory(req, res) {
        try {
            console.log(req.body);
            const newSchoolHistory = await GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
            console.log('School History Added');
            const studentRecords = await GuidanceModel.StudentRecords();
            if(newSchoolHistory.error){
                res.render('Guidance', {message: {content: 'Error updating School History'}, studentRecords: studentRecords});
            } else {
                res.render('Guidance', {message: {isSuccess: true, content: 'Student School History Successfully updated!'}, studentRecords: studentRecords})
                console.log('Record Added');
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', {message: {content: error.message}, studentRecords: studentRecords});
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
                res.json({formattedSchoolHistory});
            } else {
                const formattedSchoolHistory = {
                    enteredFrom: '',
                    gradeLevelEntered: '',
                    schoolYearAdmitted: '',
                    otherSchoolsAttended: ''
                }
                console.log('Student School history not found');
                res.json({ formattedSchoolHistory });
            }
        } catch(error) {
            console.error('Error fetching school history: ', error);
            res.status(500).send('Error processing request');
        }
    }

    async viewAnecdotalRecords(req, res) {
        const studentId = req.query.student_id;
        const studentRecords = await GuidanceModel.StudentRecords();

        const student = await Student.findByPk(studentId, {
            raw: true
        });

        
        if (student === null) {
            return res.render('Guidance', {
                studentRecords: studentRecords,
                message: { content: 'The Student ID does not exist.' }
            });
        }

        try {
            const anecdotalRecords = await GuidanceModel.fetchAnecdotalRecords(studentId);
            res.render('Guidance', {
                studentRecords: studentRecords,
                viewAnecdotal: true,
                anecdotalRecords: anecdotalRecords,
                emptyAnecdotalRecords: anecdotalRecords.length === 0,
                studentId: studentId
            });
        } catch (error) {            
            res.render('Guidance', {
                studentRecords: studentRecords,
                message: { content: 'The app cannot connect to the database.' }
            });
        }
    }

    async addAnecdotalRecord(req, res) {
        try {
            const { student_id, date, anecdotalRecord } = req.body;
            console.log(student_id, date, anecdotalRecord);
            const result = await GuidanceModel.addAnecdotalRecord(student_id, date, anecdotalRecord);
            const studentRecords = await GuidanceModel.StudentRecords();
            
            if (result.error) {
                res.render('Guidance', { message: { content: 'Error adding Anecdotal Record' }, studentRecords });
            } else {
                res.render('Guidance', { message: { isSuccess: true, content: 'Anecdotal Record added successfully!' }, studentRecords });
                console.log('Anecdotal Record Added');
            }
        } catch (error) {
            const studentRecords = await GuidanceModel.StudentRecords();
            res.render('Guidance', { message: { content: 'Error adding Anecdotal Record' }, studentRecords });
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