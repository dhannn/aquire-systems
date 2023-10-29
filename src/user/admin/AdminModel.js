import bcrypt from "bcrypt"
import {User} from "../../schema/user.js"
import { v4 as uuidv4 } from 'uuid'


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
  
            //create uuid
          const uuid = uuidv4();
            try {
              const newUser = await User.create({
                userId: uuid,
                userName: username,
                userPassword : hashedPassword,
                userType: type
              
              });
              console.log('User inserted successfully:', newUser);
              return newUser;
  
            } catch (error) {
              console.error('Error inserting user:', error);
              return null;
            }
          }
          return insertUser();
      
    }

    /**
     * Inserts the user to the database
     */
    viewUsers() {
        
    }

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
        
    }
}