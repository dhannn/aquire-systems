import bcrypt from "bcrypt";
import { User } from "../../schema/user.js";
import { Student } from "../../schema/student.js";
import { Enrolls } from "../../schema/enrolls.js";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../DBConnection.js";

export class AdminModel {
    /**
     * Inserts the user to the database
     * @param {string} username 
     * @param {string} password 
     * @param {string} type 
     */
    addUser(username, password, type) {

        async function insertUser() {

          const saltRounds = 10; 
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const uuid = uuidv4();
          try {
            const newUser = await User.create({
              userId: uuid,
              userName: username,
              userPassword: hashedPassword,
              userType: type
            });
            return { user: newUser, error: null };
          } catch (error) {
            console.error('Error inserting user:', error);
            return { user: null, error: error.message };
          }
          
          }
          return insertUser();
      
    }

  /**
   * Inserts the user to the database
   */
  viewUsers() {}

  /**
   * Inserts the student to the database
   * @param {string} id
   * @param {string} firstName
   * @param {string} middleName
   * @param {string} lastName
   * @param {int} grade
   * @param {string} section
   */
  addStudent(id, firstName, middleName, lastName, grade, section) {
    return sequelize.transaction(async (t) => {

    
      if (middleName.length > 2) {
        throw new Error("Middle initial should be at most two characters");
      } 
      
      const existingStudent = await Enrolls.findOne({
        where: {
          student_id: id,
          schoolYear: new Date().getFullYear().toString(),
        },
        transaction: t,
      });

      if (existingStudent) {
        throw new Error(
          "Student with the same ID already exists for the current school year"
        );
      } 
      try {
        const newStudent = await Student.create(
          {
            student_id: id,
            firstName: firstName,
            middleInitial: middleName,
            lastName: lastName,
          },
          { transaction: t }
        );

        await newStudent.createEnroll(
          {
            student_id: id,
            schoolYear: new Date().getFullYear().toString(),
            grade: grade,
            section: section,
          },
          { transaction: t }
        );

        console.log("Student and enrollment inserted successfully");
        return newStudent;
      } catch (error) {
        console.error("Error inserting student and/or enrollment:", error);
        throw error;
      }
    });
  }
}
