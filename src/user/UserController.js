import { Router } from "express";
import { User } from "./../schema/user.js";

export class UserController {
    startingRoute = null;
    router = null;
    model = null;
    allowedUserType = null;
    
    constructor(model) {
        this.router = new Router();
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

    static verifyUserPermission(allowedUser, _) {
        async function allowed() {
            try {
                const { cookies } = _;
                const user = await User.findAll({where: { userId: cookies.id}});

                return (user[0].userType == allowedUser || user[0].userType == 'A') 
            } catch (error) {
                console.error(error);
            }
        }
        return allowed();
    }

    static checkifloggedIn(userId) {
        const { cookies } = userId;
        if (cookies.id == null) {
            return false;
        } else {
            console.log('User is already logged in');
            return true;
        }
    }
}