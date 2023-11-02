

import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";
import { User } from "../../schema/user.js";
import {Student} from "../../schema/student.js"
import { Enrolls } from "../../schema/enrolls.js"

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
    async addStudent(req, res) {
        try {
            const newStudent = await this.model.addStudent(req.body.student_id, req.body.firstName, req.body.middleInitial, req.body.lastName, req.body.grade, req.body.section);
            res.render('Admin', { successMessage: "Student added successfully!" });
            
        } catch (error) {
            console.error(error.message);
            res.render('Admin', { errorMessage: error.message });
        }
    }
    

    addUser(req, res) {
        const newUser = this.model.addUser(req.body.userName, req.body.userPassword, req.body.userType);
        if (!newUser) {
            res.render('Admin');
        }else{
            res.render('Admin');
        }
    } 

    viewStudents(_, res) {
        res.render('Admin');
    }

    viewUsers(_, res) {
        res.render('Admin');
    }



}