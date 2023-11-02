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
}
