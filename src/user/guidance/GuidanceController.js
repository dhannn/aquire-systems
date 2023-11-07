import { UserController } from "../UserController";
import { GuidanceModel } from "./GuidanceModel";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';
    allowedUserType = 'G';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudentRecords);
        this.createRoute('POST', '/', this.addStudentRecord);
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
            res.render('Guidance', {message: { isSucess: true, content: 'Record added Successfully!'}});
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
}