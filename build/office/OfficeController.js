var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { User } from "../schema/user.js";
export class OfficeController {
    constructor(model) {
        this.startingRoute = null;
        this.model = null;
        this.allowedUserType = null;
        this.router = Router();
        this.model = model;
        this.initializeRoutes();
    }
    createRoute(method, route, action) {
        switch (method) {
            case 'GET':
                this.router.get(route, action.bind(this));
                break;
            case 'POST':
                this.router.post(route, action.bind(this));
                break;
            default:
                break;
        }
    }
    bindModel(model) {
        this.model = model;
    }
    bindToApp(app) {
        if (!this.startingRoute) {
            throw new Error('Fill in the starting route in the class implementation');
        }
        if (!this.allowedUserType) {
            throw new Error('Fill in the value for allowed user type in the class implementation');
        }
        app.use(this.startingRoute, this.router);
    }
    initializeRoutes() {
        throw new Error('Implement initializeRoutes');
    }
    initializeModel() {
        throw new Error('Implement initializeModel');
    }
    static verifyUserPermission(allowedUser, request) {
        function allowed() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { cookies } = request;
                    const user = yield User.findAll({ where: { userId: cookies.id } });
                    return (user[0].userType == allowedUser || user[0].userType == 'A');
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        return allowed();
    }
    static checkifloggedIn(userId) {
        const { cookies } = userId;
        if (cookies.id == null) {
            return false;
        }
        else {
            console.log('User is already logged in');
            return true;
        }
    }
}
