
import { User } from "../../schema/user.js";
import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";


export class AdminContoller extends UserController {
    startingRoute = '/admin';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudents);
        this.createRoute('GET', '/students',this.viewStudents);
        this.createRoute('POST', '/student', this.addStudent);
        this.createRoute('POST', '/user', this.addUser);
        this.createRoute('GET', '/users', this.viewUsers);
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

    async addUser(req, res) {
        const result = await this.model.addUser(req.body.userName, req.body.userPassword, req.body.userType);
        if (result.error) {
            if (result.error.includes("duplicate key error")) {
                res.render('Admin', { errorMessage: "Username already exists!" });
            } else {
                res.render('Admin', { errorMessage: "Username already exists!" });
            }
        } else {
            res.render('Admin', { successMessage: "User added successfully!" });
        }
    }
     
    viewStudents(_, res) {
        res.render('Admin');
    }

    viewUsers(_, res) {
        res.render('Admin');
    }



}