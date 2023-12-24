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
        const schoolYear = await CurrentSchoolYear.findOne();

        if (!schoolYear) {
            throw new Error('School year not initialized. Use the script in the ./scripts directory to initialize school year.');
        }

        return schoolYear;
    }

    async getNextSchoolYear() {
        const schoolYear = await CurrentSchoolYear.findOne();
        const from = parseInt(schoolYear.fromYear) + 1;
        const to = parseInt(schoolYear.toYear) + 1;

        return CurrentSchoolYear.build({ fromYear: from, toYear: to });
    }

    async getStudents(schoolYear, gradefilter) {    
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
            order: [['lastName', 'ASC']],
            raw: true,
        });
  
        return students;
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

  addStudent({id, firstName, middleName, lastName, grade, section}) {
    return sequelize.transaction(async (t) => {

        const schoolYear = await CurrentSchoolYear.toString();

        const student = Student.build({
            student_id: id,
            firstName: firstName,
            middleInitial: middleName,
            lastName: lastName
        });

        if (!(await student.exists())) {
            await student.save();
        }

        const enrollment = {
            schoolYear: schoolYear,
            grade: grade,
            section: section
        }

        if (await Enrolls.hasEnrolled(student, enrollment)) {
            throw new Error(`Student with ID#${id} is already enrolled. Please check the existing records to avoid duplicate enrollments.`);
        }

        const record = await Student.findByPk(id);
        
        if (!await student.equals(record)) {
            const { firstName, lastName, middleInitial } = record;
            throw new Error(`Student details with the ID#${id} do not match our existing records. The current student has the name: ${lastName}, ${firstName} ${middleInitial}. Enroll with the existing student details and feel free to edit by clicking the pen icon on the student record if details are incorrect.`);
        }
        
        await Enrolls.enroll(student, enrollment, t);

        return { student, enrollment };
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

