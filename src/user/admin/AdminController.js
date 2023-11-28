import { AdminModel } from "./AdminModel.js";
import { UserController } from "../UserController.js";
import { User } from "../../schema/user.js";
import { CurrentSchoolYear } from "../../schema/currentschoolyear.js";
import { Student } from "../../schema/student.js";
import { Enrolls } from "../../schema/enrolls.js";


export class AdminContoller extends UserController {
  startingRoute = "/admin";
  allowedUserType = "A";

  initializeRoutes() {
    this.createRoute("GET", "", this.viewStudents);
    this.createRoute("GET", "/", this.viewStudents);
    this.createRoute("GET", "/students", this.viewStudents);
    this.createRoute("GET", "/users", this.viewUsers);
    this.createRoute("POST", "/students", this.addStudent);
    this.createRoute("POST", "/users", this.addUser);
    this.createRoute('POST', '/startNewSchoolYear', this.startNewSchoolYear);
  }

  /**
   * Uses the Admin model to add a student based on the request body
   * and re-renders the page to reflect the change
   * @param {Request} req
   * @param {Response} res
   */

  async addStudent(req, res) {
    const currentSchoolYear = await CurrentSchoolYear.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!currentSchoolYear) {
      throw new Error("Current school year is not set");
    }

    const schoolYear = `${currentSchoolYear.fromYear}-${currentSchoolYear.toYear}`;
    
    const nextfromYear = parseInt(currentSchoolYear.fromYear) + 1;
    const nexttoYear = parseInt(currentSchoolYear.toYear) + 1;
    const nextschoolyear = `${nextfromYear}-${nexttoYear}`;
    var message;

    const students = await Student.findAll({
      attributes: ["student_id", "firstName", "middleInitial", "lastName"],
      include: [
        {
          model: Enrolls,
          attributes: ["grade", "section"],
          where: {
            schoolYear: schoolYear,
          },
          required: true,
        },
      ],
      raw: true,
    });

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
    } else {
      console.log('adding student info');
      try {
        await this.model.addStudent(
          req.body.student_id,
          req.body.firstName,
          req.body.middleInitial,
          req.body.lastName,
          req.body.grade,
          req.body.section
        );
        console.log("Student Added");
        message = { isSuccess: true, content: "Student added successfully!" };
      } catch (error) {
        console.error(error.message);
        message = { content: error.message };
      }
    }
    try {
      const currentSchoolYear = await CurrentSchoolYear.findOne({
        order: [["createdAt", "DESC"]],
      });
  
      if (!currentSchoolYear) {
        throw new Error("Current school year is not set");
      }
      const schoolYear = `${currentSchoolYear.fromYear}-${currentSchoolYear.toYear}`;
      const students = await Student.findAll({
        attributes: ["student_id", "firstName", "middleInitial", "lastName"],
        include: [
          {
            model: Enrolls,
            attributes: ["grade", "section"],
            where: {
              schoolYear: schoolYear,
            },
            required: true,
          },
        ],
        raw: true,
      });
        console.log("Student Added");
        
      res.set({'Refresh': `3; url=/admin/students?grade=${req.body.grade}`});
      res.render("Admin_Student", {
        message: message,
        students: students,
        schoolyear: schoolYear,
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
      req.body.userName,
      req.body.userPassword,
      req.body.userType
    );

    if (result.error) {
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
        students: students,
        schoolyear: schoolYear,
        nextschoolyear: nextschoolyear
      });
    }
  }

  async viewStudents(req, res) {
    const allowed = await UserController.verifyUserPermission(
      this.allowedUserType,
      req
    );
    const loggedIn = UserController.checkifloggedIn(req);

    if (!loggedIn) {
      return res.redirect("/");
    }

    if (!allowed) {
      return res.redirect("/");
    }
    
    const currentSchoolYear = await CurrentSchoolYear.findOne({
      order: [["createdAt", "DESC"]],
    });
    const schoolYear = `${currentSchoolYear.fromYear}-${currentSchoolYear.toYear}`;
    
    const nextfromYear = parseInt(currentSchoolYear.fromYear) + 1;
    const nexttoYear = parseInt(currentSchoolYear.toYear) + 1;
    const nextschoolyear = `${nextfromYear}-${nexttoYear}`;
    
    var gradefilter;
    if (req.query.grade == null) {
      return res.redirect('/admin/students?grade=Kinder');
    } else {
      gradefilter = req.query.grade;
    }

    const students = await Student.findAll({
      attributes: ["student_id", "firstName", "middleInitial", "lastName"],
      include: [
        {
          model: Enrolls,
          attributes: ["grade", "section"],
          where: {
            schoolYear: schoolYear,
            grade: gradefilter,
          },
          required: true,
        },
      ],
      raw: true,
    });

    try {
      if (!currentSchoolYear) {
        throw new Error("Current school year is not set");
      }

      if (!students || students.length === 0) {
        return res.render("Admin_Student", {
          students: [],
          schoolyear: schoolYear,
          nextschoolyear: nextschoolyear,
          
          K: gradefilter === 'Kinder',
          SK: gradefilter === 'Senior Kinder',
          G1: gradefilter === 'Grade 1',
          G2: gradefilter === 'Grade 2',
          G3: gradefilter === 'Grade 3',
          G4: gradefilter === 'Grade 4',
          G5: gradefilter === 'Grade 5',
          G6: gradefilter === 'Grade 6',
          G7: gradefilter === 'Grade 7',
          G8: gradefilter === 'Grade 8',
          G9: gradefilter === 'Grade 9',
          G10: gradefilter === 'Grade 10',
          G11: gradefilter === 'Grade 11',
          G12: gradefilter === 'Grade 12',
        });
      }

      res.render("Admin_Student", { 
        students: students,
        schoolyear: schoolYear,
        nextschoolyear: nextschoolyear,
        //for current proccing
        K: gradefilter === 'Kinder',
        SK: gradefilter === 'Senior Kinder',
        G1: gradefilter === 'Grade 1',
        G2: gradefilter === 'Grade 2',
        G3: gradefilter === 'Grade 3',
        G4: gradefilter === 'Grade 4',
        G5: gradefilter === 'Grade 5',
        G6: gradefilter === 'Grade 6',
        G7: gradefilter === 'Grade 7',
        G8: gradefilter === 'Grade 8',
        G9: gradefilter === 'Grade 9',
        G10: gradefilter === 'Grade 10',
        G11: gradefilter === 'Grade 11',
        G12: gradefilter === 'Grade 12',
       });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).render("error", {
        students: students,
        error: "An error occurred while fetching the students.",
        schoolyear: schoolYear,
        nextschoolyear: nextschoolyear
      });
    }
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
  }