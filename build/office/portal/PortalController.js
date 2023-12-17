var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../../schema/user.js";
import { OfficeController } from "../OfficeController.js";
export class PortalContoller extends OfficeController {
    constructor() {
        super(...arguments);
        this.startingRoute = '/';
        this.allowedUserType = '-';
        this.routes = {};
    }
    initializeRoutes() {
        this.createRoute('GET', '', this.viewPortal);
        this.createRoute('GET', '/login', this.viewPortal);
        this.createRoute('POST', '/login', this.loginUser);
        this.createRoute('GET', '/logout', this.logoutUser);
    }
    addUserRoute(route) {
        this.routes[route.allowedUserType] = route;
    }
    /**
     * Uses the Admin model to add a student based on the request body
     * and re-renders the page to reflect the change
     * @param {Request} req
     * @param {Response} res
     */
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cookies } = req;
            const userToLogin = yield this.model.confirmUserByUsername(req.body.userName, req.body.userPassword);
            if (userToLogin != null) {
                const loginStatus = OfficeController.checkifloggedIn(req);
                if (loginStatus) {
                    res.redirect('/');
                }
                else {
                    res.cookie('id', userToLogin);
                    res.status(200);
                    res.redirect('/');
                }
            }
            else {
                res.render('Portal', { message: { content: 'Invalid credentials. Please try again.' } });
            }
        });
    }
    logoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('id');
            res.redirect('/');
        });
    }
    viewPortal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cookies } = req;
            const loginStatus = OfficeController.checkifloggedIn(req);
            if (loginStatus) {
                //redirect
                const user = yield User.findAll({ where: { userId: cookies.id } });
                const type = user[0].userType;
                const startingRoute = this.routes[type].startingRoute;
                res.redirect(startingRoute);
            }
            else {
                res.render('Portal');
            }
        });
    }
}
