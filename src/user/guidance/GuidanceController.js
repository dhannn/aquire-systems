import { UserController } from "../UserController.js";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';
    allowedUserType = 'G';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewGuidancePage);
    }

    viewGuidancePage(req, res) {
        res.render('Guidance');
    }
}