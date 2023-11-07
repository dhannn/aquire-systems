

import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";
import { User } from "../../schema/user.js";
import { Student } from "../../schema/student.js";


export class AdminContoller extends UserController {
    startingRoute = '/admin';
    allowedUserType = 'A';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudents);
        this.createRoute('GET', '/students',this.viewStudents);
        this.createRoute('GET', '/users', this.viewUsers);
        this.createRoute('POST', '/students', this.addStudent);
        this.createRoute('POST', '/users', this.addUser);
    }

    /**
     * Uses the Admin model to add a student based on the request body 
     * and re-renders the page to reflect the change
     * @param {Request} req 
     * @param {Response} res 
     */

    
    async addStudent(req, res) {
        try {
            const newStudent = await this.model.addStudent(req.body.student_id, req.body.firstName, req.body.middleInitial, req.body.lastName, req.body.grade, req.body.section);
            res.render('Admin_Student', { message: { isSuccess: true, content: 'Student added sucessfully!' } });
            console.log("Student Added")
        } catch (error) {
            console.error(error.message);
            res.render('Admin_Student', { message: { content: error.message } });
        }
    }

    async addUser(req, res) {
        const result = await this.model.addUser(req.body.userName, req.body.userPassword, req.body.userType);

        if (result.error) {
            if (result.error.includes("duplicate key error")) {
                res.render('Admin_User', { message: { content: "Username already exists!" } });
            } else {
                res.render('Admin_User', { message: { content: "Username already exists!" }  });
            }
        } else {
            res.render('Admin_User', { message: { isSuccess: true, content: "User added successfully!" } });
        }
    }
     
    async viewStudents(_, res) {
        const allowed = await UserController.verifyUserPermission(this.allowedUserType, _)
        const loggedIn = UserController.checkifloggedIn(_);

        const students = await Student.findAll({
            attributes: ['userName', 'userType'],
            raw: true
        });
        
        if (loggedIn) {
            if (allowed) {
                res.render('Admin_Student');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    }

    async viewUsers(_, res) {
        const allowed = await UserController.verifyUserPermission(this.allowedUserType, _)
        const loggedIn = UserController.checkifloggedIn(_);
        
        if (loggedIn) {
            if (allowed) {
                res.render('Admin_User');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    }

}