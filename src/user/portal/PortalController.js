import { User } from "../../schema/user.js";
import { UserController } from "../UserController.js";

export class PortalContoller extends UserController {
    startingRoute = '/';
    allowedUserType = '-';
    routes = {}

    initializeRoutes() {
        this.createRoute('GET', '', this.viewPortal);
        this.createRoute('GET', '/login',this.viewPortal);
        this.createRoute('POST', '/login', this.loginUser);
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
    async loginUser(req, res) {
        const { cookies } = req;
        const userToLogin = await this.model.confirmUserByUsername(req.body.userName, req.body.userPassword);
        
        if (userToLogin != null) {
            const loginStatus = UserController.checkifloggedIn(req);

            if (loginStatus) {
                res.redirect('/');
            } else {
                res.cookie('id', userToLogin);
                res.status(200);
                res.redirect('/');
            }
            
        } else {
            res.render('Portal', { message: { content: 'Invalid credentials. Please try again.' } })
        }
    }

    async viewPortal(req, res) {
        const { cookies } = req;
        const loginStatus = UserController.checkifloggedIn(req);
        if (loginStatus) {
            //redirect
            const user = await User.findAll({where: { userId: cookies.id}});
            const type = user[0].userType;
            
            const startingRoute = this.routes[type].startingRoute;
            res.redirect(startingRoute);
        } else  {
            res.render('Portal');
        }
    }
}