import { UserController } from "../UserController.js";

export class GuidanceController extends UserController {
    startingRoute = '/guidance';
    allowedUserType = 'G';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewGuidancePage);
    }

    async viewGuidancePage(req, res) {
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