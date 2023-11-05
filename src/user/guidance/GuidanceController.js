import { UserController } from "../UserController";
import { GuidanceModel } from "./guidanceModel";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudentRecords);
        this.createRoute('POST', '/', this.addStudentRecord);
    }

    /**
     * uses Admin model to add student records into the database
     * @param {Request} req 
     * @param {Response} res 
     */
    addStudentRecord(req, res) {
        GuidanceModel.addStudentRecord(req.body.studentId, req.body.recordType);
        res.render('Guidance');
    }

    /**
     * Creates the view for the guidance student records and initializes all record types
     * @param {Request} _ 
     * @param {Response} res 
     */
    viewStudentRecords(_, res) {
        GuidanceModel.initializeRecordTypes();
        res.render('Guidance');
    }
}