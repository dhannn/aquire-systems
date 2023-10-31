import { UserController } from "../UserController";
import { GuidanceModel } from "./GuidanceModel";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudentRecords);
        this.createRoute('POST', '/', this.addStudentRecord);
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    addStudentRecord(req, res) {
        GuidanceModel.addStudentRecord(req.body.studentId, req.body.recordType);
        res.render('Guidance');
    }

    viewStudentRecords(_, res) {
        GuidanceModel.initializeRecordTypes();
        res.render('Guidance');
    }
}