

import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";
import { User } from "../../schema/user.js";
import {Student} from "../../schema/student.js"
import { Enrolls } from "../../schema/enrolls.js"

export class AdminContoller extends UserController {
    startingRoute = '/admin';

    initializeRoutes() {
        this.createRoute('GET', '/', (_, res) => res.redirect('/admin/students'));
        this.createRoute('GET', '/students',this.viewStudents);
        this.createRoute('POST', '/students', this.addStudent);
        this.createRoute('POST', '/users', this.addUser);
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
            res.render('Admin_Student', { message: { isSuccess: true, content: 'Student added sucessfully!' } });
            console.log("Student Added")
        } catch (error) {
            console.error(error.message);
            res.render('Admin_Student', { message: { content: error.message } });
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
        res.render('Admin_Student');
    }

    viewUsers(_, res) {
        res.render('Admin_Student');
    }



}