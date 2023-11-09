import { UserController } from "../UserController";
import { GuidanceModel } from "./GuidanceModel";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';
    allowedUserType = 'G';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewGuidancePage);
        this.createRoute('POST', '/', this.addStudentRecord);
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
            const {userStudentID, recordTypes} = req.body;
            const newRecord = await GuidanceModel.addStudentRecord(userStudentID, recordTypes);
            res.render('Guidance', {message: { isSuccess: true, content: 'Record added successfully!'}});
            console.log('Record Added');
        } catch (error) {
            res.render('Guidance', {message: {content: error.message}});
        }
    }

    /**
     * Creates the view for the guidance student records and initializes all record types
     * @param {Request} _ 
     * @param {Response} res 
     */
    async viewGuidancePage(_, res) {
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
}