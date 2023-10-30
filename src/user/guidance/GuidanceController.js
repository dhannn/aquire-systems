import { UserController } from "../UserController";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudentRecords);
        this.createRoute('POST', '/', this.ModifyStudentRecords)
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    ModifyStudentRecords(req, res) {
        res.render('Guidance')
    }

    viewStudentRecords(_, res) {
        res.render('Guidance');
    }
}