

import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";


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

 
    
    /**
     * TODO: Fix redirection
     */
    async addUser(req, res) {
        const result = await this.model.addUser(req.body.userName, req.body.userPassword, req.body.userType);

        if (result.error) {
            if (result.error.includes("duplicate key error")) {
                res.render('Admin', { message: { content: "Username already exists!" } });
            } else {
                res.render('Admin', { message: { content: "Username already exists!" }  });
            }
        } else {
            res.render('Admin', { message: { isSuccess: true, content: "User added successfully!" } });
        }
    }
     
    viewStudents(_, res) {
        res.render('Admin');
    }

    viewUsers(_, res) {
        res.render('Admin_User');
    }

}