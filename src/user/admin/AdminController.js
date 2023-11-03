
import { User } from "../../schema/user.js";
import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";
import { NIL } from "uuid";


export class AdminContoller extends UserController {
    startingRoute = '/admin';
    alloweduserType = 'A';

    initializeRoutes() {
        this.createRoute('GET', '', this.viewStudents);
        this.createRoute('GET', '/', this.viewStudents);
        this.createRoute('GET', '/users', this.viewUsers);
        this.createRoute('GET', '/students',this.viewStudents);
        this.createRoute('POST', '/student', this.addStudent);
        this.createRoute('POST', '/user', this.addUser);
        
    }

    /**
     * Uses the Admin model to add a student based on the request body 
     * and re-renders the page to reflect the change
     * @param {Request} req 
     * @param {Response} res 
     */
    addStudent(req, res) {
        res.send('<h1>hello</h1>');
    } 

    addUser(req, res) {
        const newUser = this.model.addUser(req.body.userName, req.body.userPassword, req.body.userType);
        if (!newUser) {
            res.render('Admin');
        }else{  
            res.render('Admin');
        }
    } 


    async viewStudents(_, res) {
        const { cookies } = _;
        const allowed = await UserController.verifyUserPermission(this.alloweduserType, cookies.id);
        const loggedIn = UserController.checkifloggedIn(_);

        if (allowed != null) {
            if (loggedIn && allowed) {
                res.render('Admin');
            }
        } else {
            res.redirect('/');
        }
    }

    viewUsers(_, res) {
        res.render('Admin');
    }



}