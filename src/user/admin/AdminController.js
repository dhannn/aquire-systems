import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";
import { User } from "../../schema/user.js";
import { CurrentSchoolYear } from "../../schema/currentschoolyear.js";
import { Student } from "../../schema/student.js";
import { Enrolls } from "../../schema/enrolls.js";


export class AdminContoller extends UserController {
  startingRoute = "/admin";
  allowedUserType = "A";
  gradeMap = {
    'Kinder': 'K',
    'Senior Kinder': 'SK',
    'Grade 1':  'G1',
    'Grade 2':  'G2',
    'Grade 3':  'G3',
    'Grade 4':  'G4',
    'Grade 5':  'G5',
    'Grade 6':  'G6',
    'Grade 7':  'G7',
    'Grade 8':  'G8',
    'Grade 9':  'G9',
    'Grade 10': 'G10',
    'Grade 11': 'G11',
    'Grade 12': 'G12'
  }

  initializeRoutes() {
    this.router.use(this.loggedIn.bind(this));
    this.router.use(this.authenticateUser.bind(this));

    this.createRoute("GET", "/", this.viewStudents, this.fetchStudents);
    this.createRoute("GET", "/students", this.viewStudents, this.fetchStudents);
    this.createRoute("POST", "/students", this.addStudent, this.fetchStudents);
    this.createRoute('POST', '/startNewSchoolYear', this.startNewSchoolYear, this.fetchStudents);
    this.createRoute("GET", "/users", this.viewUsers);
    this.createRoute("POST", "/users", this.addUser);
  }

  async editStudent(req, res) {
    const currentSchoolYear = req.schoolYear;
    
    const nextfromYear = parseInt(currentSchoolYear.fromYear) + 1;
    const nexttoYear = parseInt(currentSchoolYear.toYear) + 1;
    const nextschoolyear = `${nextfromYear}-${nexttoYear}`;
    var message;
    
    // TODO: Extract method to AdminModel
    const students = req.students;

    // TODO: Extract method to `editStudent()` method
    if(req.body.edit_student){
      console.log('updating student info');
      const updateStudent = await this.model.updateExistingStudentInfo(
          req.body.student_id,
          req.body.firstName,
          req.body.middleInitial,
          req.body.lastName,
          req.body.grade,
          req.body.section
      );
      if(updateStudent.error){
        console.error(updateStudent.error);
        message = { content: updateStudent.error };
      } else {
        console.log("Student Updated");
        message = { isSuccess: true, content: "Student updated successfully!" };
      }
    }
  }

  /**
   * Uses the Admin model to add a student based on the request body
   * and re-renders the page to reflect the change
   * @param {Request} req
   * @param {Response} res
   */

  async addStudent(req, res) {
    const currentSchoolYear = req.schoolYear;
    
    const nextfromYear = parseInt(currentSchoolYear.fromYear) + 1;
    const nexttoYear = parseInt(currentSchoolYear.toYear) + 1;
    const nextschoolyear = `${nextfromYear}-${nexttoYear}`;
    var message;
    
    // TODO: Extract method to AdminModel
    const students = req.students;

    // TODO: Extract method to `editStudent()` method
    console.log('adding student info');
    try {
      await this.model.addStudent({
        id: req.body.student_id,
        firstName: req.body.firstName,
        middleName: req.body.middleInitial,
        lastName: req.body.lastName,
        grade: req.query.grade,
        section: req.body.section
      });
      console.log("Student Added");
      message = { isSuccess: true, content: "Student added successfully!" };
    } catch (error) {
      console.error(error.message);
      message = { content: error.message };
    }
    
    try {
      const currentSchoolYear = await CurrentSchoolYear.findOne({
        order: [["createdAt", "DESC"]],
      });
  
      if (!currentSchoolYear) {
        throw new Error("Current school year is not set");
      }
      const schoolYear = req.schoolYear.toString();
      const students = req.students;
      console.log("Student Added");
      
      res.set({'Refresh': `3; url=/admin/students?grade=${req.query.grade}`});
      res.render("Admin_Student", {
        message: message,
        students: req.students,
        schoolyear: await req.schoolYear.toString(),
        nextschoolyear: nextschoolyear
      });
    } catch (error) {
      console.error(error.message);
      res.render("Admin_Student", {
        message: { content: "Failed to fetch students: " + error.message },
        students: [],
      });
    }
  }
  
  async addUser(req, res) {
    const result = await this.model.addUser(
      // TODO: Extract constants
      req.body.userName,
      req.body.userPassword,
      req.body.userType
    );

    if (result.error) {
      // TODO: Simplify logic
      if (result.error.includes("duplicate key error")) {
        res.render("Admin_User", {
          message: { content: "Username already exists!" },
        });
      } else {
        res.render("Admin_User", {
          message: { content: "Username already exists!" },
        });
      }
    } else {
      res.render("Admin_User", {
        message: { isSuccess: true, content: "User added successfully!" },
        students: req.students,
        schoolyear: schoolYear,
        nextschoolyear: nextschoolyear
      });
    }
  }

  async viewStudents(req, res) {
    const schoolYear = await req.schoolYear.toString();
    const nextSchoolYear = await (await this.model.getNextSchoolYear()).toString();
    const students = req.students;
    const gradefilter = req.gradefilter;
  
    res.render("Admin_Student", { 
      students: students,
      schoolyear: schoolYear,
      nextschoolyear: nextSchoolYear,
      currgrade: gradefilter,
      [ this.gradeMap[gradefilter] ]: true
      });
  }
  
  async addUser(req, res) {
        const result = await this.model.addUser(req.body.userName, req.body.userPassword, req.body.userType);

        //repeatable section start---
        const users = await User.findAll({
            attributes: ['userName', 'userType'],
            raw: true
        });

        for (let i = 0; i < users.length; i++) {
            //apply changes to make things human readable
            if (users[i].userType == 'A') {
                users[i].userType = 'Admin';
            } else if (users[i].userType == 'G') {
                users[i].userType = 'Guidance'
            } else {
                console.log("Database Error: No usertype.");
            }
        }
        //repeatable section end--

        if (result.error) {
            if (result.error.includes("duplicate key error")) {
                res.render('Admin_User', {
                    users: users, 
                    message: { content: "Username already exists!" } });
            } else {
                res.render('Admin_User', { 
                    users: users,
                    message: { content: "Username already exists!" }  });
            }
        } else {
            res.render('Admin_User', { 
                message: { isSuccess: true, content: "User added successfully!" },
                users: users
            });
        }
    }
   /**
     * Starts a new school year
     * @param {Request} req
     * @param {Response} res
     */

   async startNewSchoolYear(req, res) {
    res.set({'Refresh': '3; url=/admin/students/'});
    
    try {
        const updatedSchoolYear = await this.model.startNewSchoolYear();
        res.render('Admin_Student', {
            message: { isSuccess: true, content: 'New school year started successfully!' },
            schoolyear: `${updatedSchoolYear.fromYear} - ${updatedSchoolYear.toYear}`,
        });
    } catch (error) {
        console.error(error.message);
        res.render('Admin_Student', {
            message: { content: error.message },
        });
    }
  }
    async viewUsers(_, res) {
        const allowed = await UserController.verifyUserPermission(this.allowedUserType, _)
        const loggedIn = UserController.checkifloggedIn(_);
        const users = await User.findAll({
            attributes: ['userName', 'userType'],
            order:[['userName', 'ASC']],
            raw: true
        });

        for (let i = 0; i < users.length; i++) {
            //apply changes to make things human readable
            if (users[i].userType == 'A') {
                users[i].userType = 'Admin';
            } else if (users[i].userType == 'G') {
                users[i].userType = 'Guidance'
            } else {
                console.log("Database Error: No usertype.");
            }
        }
        
        if (loggedIn) {
            if (allowed) {
                res.render('Admin_User', { users: users });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    }

    async fetchStudents(req, res, next) {
      try {
        let schoolYear = await this.model.getSchoolYear();
        req.schoolYear = schoolYear;   
      
        if (!req.query.grade) {
          return res.redirect('/admin/students?grade=Kinder');
        } 
        
        let gradefilter = req.query.grade;
        req.gradefilter = gradefilter;
        req.students = await this.model.getStudents(await schoolYear.toString(), gradefilter);

        next();
      } catch (error) {
        console.log('Error: ' + error);
        return;
      }
    }
  }