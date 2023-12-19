import bcrypt from "bcrypt";
import { User } from "../../schema/user.js";
import { Student } from "../../schema/student.js";
import { Enrolls } from "../../schema/enrolls.js";
import { CurrentSchoolYear } from "../../schema/currentschoolyear.js";
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
                    userType: type,
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

    async getSchoolYear() {
        return await CurrentSchoolYear.findOne();
    }

  /**
   * Inserts the student tow the database
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

        // TODO: Extract method in AdminModel
        const currentSchoolYear = await this.getSchoolYear();

        if (!currentSchoolYear) {
            throw new Error("Current school year is not set");
        }

        // TODO: Extract to toString() method
        const schoolYear = await CurrentSchoolYear.toString();

        // TODO: Extract method in AdminModel
        const existingStudent = await Student.findOne({
            where: { student_id: id },
            transaction: t,
        });

        if (existingStudent) {
            if (existingStudent.firstName === firstName &&
                existingStudent.middleInitial === middleName &&
                existingStudent.lastName === lastName) {

                // TODO: Extract method in AdminModel
                const alreadyEnrolled = await Enrolls.findOne({
                    where: {
                        student_id: id,
                        schoolYear: schoolYear,
                    },
                    transaction: t,
                });

                if (alreadyEnrolled) {
                    throw new Error("Student is already enrolled for the current school year");
                }

                // TODO: Extract method in AdminModel
                await Enrolls.create({
                    student_id: id,
                    schoolYear: schoolYear,
                    grade: grade,
                    section: section,
                }, { transaction: t });
                console.log("Enrollment added for existing student");
                return existingStudent;
            } else {
                throw new Error("Student details do not match with existing records");
            }
        }

        try {
            // TODO: Extract method in AdminModel
            const newStudent = await Student.create({
                student_id: id,
                firstName: firstName,
                middleInitial: middleName,
                lastName: lastName,
            }, { transaction: t });

            await newStudent.createEnroll({
                student_id: id,
                schoolYear: schoolYear,
                grade: grade,
                section: section,
            }, { transaction: t });

            console.log("Student and enrollment inserted successfully");
            return newStudent;
        } catch (error) {
            console.error("Error inserting student and/or enrollment:", error);
            throw error;
        }
    });
  }


    async startNewSchoolYear() {
        try {
            return await CurrentSchoolYear.next();
        } catch (error) {
            console.log(error);
            return error;
        }
    }


 // TODO: Extract method to CurrentSchoolYear object
 async updateCurrentSchoolYear(fromYear, toYear) {
  try {
      // Update the current school year range in the CurrentSchoolYear table
      const [updatedRows] = await CurrentSchoolYear.update(
          { fromYear, toYear },
          { where: {} }
      );

      if (updatedRows === 0) {
          throw new Error('Failed to update the current school year');
      }

      return { fromYear, toYear };
  } catch (error) {
      console.error('Error updating the current school year:', error);
      throw error;
  }
}

  async updateExistingStudentInfo(id, firstName, middleName, lastName, grade, section) {
    try{
      const student = await Student.update({
        firstName: firstName,
        middleInitial: middleName,
        lastName: lastName,
      }, {
        where: {
          student_id: id
        }
      });
      const enrolls = await Enrolls.update({
        grade: grade,
        section: section,
      }, {
        where:{
          student_id: id
        }
      });
      return {student: student, enrolls: enrolls};
    } catch(error) {
      console.error('Error updating student information')
      return {error: error};
    }
  }
}

