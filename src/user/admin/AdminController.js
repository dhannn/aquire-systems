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

      res.render("Admin_Student", {
        message: { isSuccess: true, content: "Student added successfully!" },
        students: students,
      });
    } catch (error) {
      console.error(error.message);
      res.render("Admin_Student", {
        message: { content: error.message },
        students: [],
      });
    }
  }

  async viewStudents(_, res) {
    const allowed = await UserController.verifyUserPermission(
      this.allowedUserType,
      _
    );
    const loggedIn = UserController.checkifloggedIn(_);

    if (!loggedIn) {
      return res.redirect("/");
    }

    if (!allowed) {
      return res.redirect("/");
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

      if (!students || students.length === 0) {
        return res.render("Admin_Student", {
          students: [],
          message: "No students found for the current school year.",
        });
      }

      res.render("Admin_Student", { students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).render("error", {
        error: "An error occurred while fetching the students.",
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
    try {
        const updatedSchoolYear = await this.model.startNewSchoolYear();
        res.render('Admin_Student', {
            message: { isSuccess: true, content: 'New school year started successfully!' },
            schoolYear: `${updatedSchoolYear.fromYear} - ${updatedSchoolYear.toYear}`,
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
