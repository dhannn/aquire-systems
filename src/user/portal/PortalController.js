import { User } from "../../schema/user.js";
import { UserController } from "../UserController.js";

export class PortalContoller extends UserController {
    startingRoute = '/portal';

    initializeRoutes() {
        this.createRoute('GET', '', this.viewPortal);
        this.createRoute('GET', '/', this.viewPortal);
        this.createRoute('GET', '/login',this.viewPortal);
        this.createRoute('POST', '/login', this.loginUser);
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
                
            } else {
                res.cookie('id', userToLogin);
                res.status(200);
            }
            res.redirect('/portal');

            // UserController.verifyUserPermission(userToLogin, res);
        } else {
            res.render('Portal')
        }
    } 


    async viewPortal(_, res) {
        const { cookies } = _;
        const loginStatus = UserController.checkifloggedIn(_);
        if (loginStatus) {
            //redirect
            const user = await User.findAll({where: { userId: cookies.id}});
            const type = user[0].userType;
            if (type == 'A') {
                res.redirect('/admin');
            } else if (type == 'M'){
                res.redirect('/medical');
            } else if (type == 'G') {
                res.redirect('/guidance');
            }
        } else  {
            res.render('Portal');
        }
    }
}