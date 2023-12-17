var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { cookie } from "express-validator";
import { User } from "../../schema/user.js";
export class PortalModel {
    /**
     * Inserts the user to the database
     * @param {string} username
     * @param {string} password
     * @param {string} type
     */
    confirmUserByUsername(username, password) {
        function validateLogin() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    //First find if the user exists in the database
                    const foundUser = yield User.findAll({
                        where: {
                            userName: username
                        }
                    });
                    console.log('User exists');
                    var hash = foundUser[0].userPassword;
                    var passed = yield bcrypt.compare(password, hash);
                    if (!passed) {
                        return null;
                    }
                    else {
                        return foundUser[0].userId;
                    }
                }
                catch (error) {
                    console.error("User does not exist");
                    return null;
                }
            });
        }
        return validateLogin();
    }
}
