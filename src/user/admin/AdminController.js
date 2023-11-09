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

  async viewUsers(_, res) {
    const allowed = await UserController.verifyUserPermission(
      this.allowedUserType,
      _
    );
    const loggedIn = UserController.checkifloggedIn(_);

    if (loggedIn) {
      if (allowed) {
        res.render("Admin_User");
      } else {
        res.redirect("/");
      }
    } else {
      res.redirect("/");
    }
  }
}
