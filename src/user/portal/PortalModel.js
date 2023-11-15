import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import { cookie } from "express-validator";
import {User} from "../../schema/user.js"


export class PortalModel {
    /**
     * Inserts the user to the database
     * @param {string} username 
     * @param {string} password 
     * @param {string} type 
     */
    confirmUserByUsername (username, password) {

        async function validateLogin() {
            try {
                //First find if the user exists in the database
                const foundUser = await User.findAll({
                    where: {
                        userName: username
                    }
                });
                console.log('User exists');
                var hash = foundUser[0].userPassword;
                var passed = await bcrypt.compare(password, hash);
                if (!passed) {
                    return null;
                } else { 
                    return foundUser[0].userId;
                }
            } catch (error) {
                console.error("User does not exist");
                return null;
            }
        }
        return validateLogin();
      
    }
    
}