import { UserController } from "../UserController.js";

export class AdminContoller extends UserController {
    startingRoute = '/admin';

    initializeRoutes() {
        this.createRoute('GET', '/', this.viewStudents);
        this.createRoute('GET', '/students',this.viewStudents);
        this.createRoute('POST', '/student', this.addStudent);
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

    viewStudents(_, res) {
        res.send('<h1>hello</h1>');
    }

    viewUsers(_, res) {
        res.send('<h1>hello</h1>');
    }

}