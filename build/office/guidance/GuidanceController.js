var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AdmissionRecord } from "../../schema/admissionrecord.js";
import { SchoolHistory } from "../../schema/schoolhistory.js";
import { OfficeController } from "../OfficeController.js";
import { GuidanceModel } from "./GuidanceModel.js";
import { AnecdotalRecord } from "../../schema/AnecdotalRecord.js";
import { Student } from "../../schema/student.js";
import { CurrentSchoolYear } from '../../schema/currentschoolyear.js';
import { Enrolls } from "../../schema/enrolls.js";
export class GuidanceController extends OfficeController {
    constructor() {
        super(...arguments);
        this.startingRoute = '/guidance';
        this.allowedUserType = 'G';
    }
    initializeRoutes() {
        this.createRoute('GET', '/', this.viewGuidancePage);
        this.createRoute('POST', '/', this.getStudentRecords);
        this.createRoute('GET', '/records', this.viewGuidancePage);
        this.createRoute('POST', '/records', this.addStudentRecord);
        this.createRoute('GET', '/anecdotal', this.viewAnecdotalRecords);
        this.createRoute('POST', '/anecdotal', this.addAnecdotalRecord);
        // this.createRoute('GET', '/history', this.viewStudentSchoolHistory);
        // this.createRoute('POST', '/history', this.addStudentSchoolHistory);
    }
    /**
        this.createRoute('GET', '/cummulative', this.viewGuidancePage);
        this.createRoute('POST', '/cummulative', this.updateStudentSchoolHistory);
        this.createRoute('POST', '/cummulative-get', this.getStudentSchoolHistory);
        

    }

    /**
     * uses Admin model to add student records into the database
     * @param {Request} req
     * @param {Response} res
     */
    addStudentRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { student_id, recordTypes } = req.body;
                console.log(recordTypes);
                const result = yield GuidanceModel.addStudentRecord(student_id, recordTypes);
                const studentRecords = yield GuidanceModel.StudentRecords();
                if (result.error) {
                    res.render('Guidance', { message: { content: 'Error adding Record' }, studentRecords: studentRecords });
                }
                else {
                    res.render('Guidance', { message: { isSuccess: true, content: 'Student Record added successfully!' }, studentRecords: studentRecords });
                    console.log('Record Added');
                }
            }
            catch (error) {
                const studentRecords = yield GuidanceModel.StudentRecords();
                res.render('Guidance', { message: { content: 'Error adding Record' }, studentRecords: studentRecords });
            }
        });
    }
    /**
     * Creates the view for the guidance student records and initializes all record types
     * @param {Request} _
     * @param {Response} res
     */
    viewGuidancePage(_, res) {
        return __awaiter(this, void 0, void 0, function* () {
            GuidanceModel.initializeRecordTypes();
            const allowed = yield OfficeController.verifyUserPermission(this.allowedUserType, _);
            const loggedIn = OfficeController.checkifloggedIn(_);
            const studentRecords = yield GuidanceModel.StudentRecords();
            if (loggedIn) {
                if (allowed) {
                    res.render('Guidance', { studentRecords: studentRecords });
                }
                else {
                    res.redirect('/');
                }
            }
            else {
                res.redirect('/');
            }
        });
    }
    getStudentRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = req.body.textData;
            try {
                // Query the database to find records for the student
                const records = yield AdmissionRecord.findAll({
                    where: { student_id: studentId },
                    attributes: ['recordId']
                });
                // Convert to a format suitable for the frontend to process
                const recordIds = records.map(r => r.recordId);
                res.json({ recordIds });
            }
            catch (error) {
                console.error('Error fetching student records:', error);
                res.status(500).send('Error processing request');
            }
        });
    }
    updateStudentSchoolHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const newSchoolHistory = yield GuidanceModel.updateStudentSchoolHistory(req.body.student_id, req.body.enteredFrom, req.body.gradeLevelEntered, req.body.schoolYearAdmitted, req.body.otherSchoolsAttended);
                console.log('School History Added');
                const studentRecords = yield GuidanceModel.StudentRecords();
                if (newSchoolHistory.error) {
                    res.render('Guidance', { message: { content: 'Error updating School History' }, studentRecords: studentRecords });
                }
                else {
                    res.render('Guidance', { message: { isSuccess: true, content: 'Student School History Successfully updated!' }, studentRecords: studentRecords });
                    console.log('Record Added');
                }
            }
            catch (error) {
                const studentRecords = yield GuidanceModel.StudentRecords();
                res.render('Guidance', { message: { content: error.message }, studentRecords: studentRecords });
            }
        });
    }
    getStudentSchoolHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = req.body.textData;
            try {
                const schoolHistory = yield SchoolHistory.findOne({
                    where: { student_id: studentId }
                });
                if (schoolHistory) {
                    const formattedSchoolHistory = {
                        enteredFrom: schoolHistory.enteredFrom,
                        gradeLevelEntered: schoolHistory.gradeLevelEntered,
                        schoolYearAdmitted: schoolHistory.schoolYearAdmitted,
                        otherSchoolsAttended: schoolHistory.otherSchoolsAttended
                    };
                    console.log('Successfully fetched student school history: ', schoolHistory);
                    res.json({ formattedSchoolHistory });
                }
                else {
                    const formattedSchoolHistory = {
                        enteredFrom: '',
                        gradeLevelEntered: '',
                        schoolYearAdmitted: '',
                        otherSchoolsAttended: ''
                    };
                    console.log('Student School history not found');
                    res.json({ formattedSchoolHistory });
                }
            }
            catch (error) {
                console.error('Error fetching school history: ', error);
                res.status(500).send('Error processing request');
            }
        });
    }
    viewAnecdotalRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = req.query.student_id;
            const studentRecords = yield GuidanceModel.StudentRecords();
            const student = yield Student.findByPk(studentId, {
                raw: true
            });
            if (student === null) {
                return res.render('Guidance', {
                    studentRecords: studentRecords,
                    message: { content: 'The Student ID does not exist.' }
                });
            }
            try {
                const anecdotalRecords = yield GuidanceModel.fetchAnecdotalRecords(studentId);
                res.render('Guidance', {
                    studentRecords: studentRecords,
                    viewAnecdotal: true,
                    anecdotalRecords: anecdotalRecords,
                    emptyAnecdotalRecords: anecdotalRecords.length === 0,
                    studentId: studentId
                });
            }
            catch (error) {
                res.render('Guidance', {
                    studentRecords: studentRecords,
                    message: { content: 'The app cannot connect to the database.' }
                });
            }
        });
    }
    addAnecdotalRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { student_id, date, anecdotalRecord } = req.body;
                console.log(student_id, date, anecdotalRecord);
                const result = yield GuidanceModel.addAnecdotalRecord(student_id, date, anecdotalRecord);
                const studentRecords = yield GuidanceModel.StudentRecords();
                if (result.error) {
                    res.render('Guidance', { message: { content: 'Error adding Anecdotal Record' }, studentRecords });
                }
                else {
                    res.render('Guidance', { message: { isSuccess: true, content: 'Anecdotal Record added successfully!' }, studentRecords });
                    console.log('Anecdotal Record Added');
                }
            }
            catch (error) {
                const studentRecords = yield GuidanceModel.StudentRecords();
                res.render('Guidance', { message: { content: 'Error adding Anecdotal Record' }, studentRecords });
            }
        });
    }
    /**
     * Updates the checklist of student records whenever a Student ID is entered in the textbox
     * @param {Request} req
     * @param {Response} res
     */
    getStudentRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const studentId = req.body.textData;
            try {
                // Query the database to find records for the student
                const records = yield AdmissionRecord.findAll({
                    where: { student_id: studentId },
                    attributes: ['recordId']
                });
                // Convert to a format suitable for the frontend to process
                const recordIds = records.map(r => r.recordId);
                res.json({ recordIds });
            }
            catch (error) {
                console.error('Error fetching student records:', error);
                res.status(500).send('Error processing request');
            }
        });
    }
}
