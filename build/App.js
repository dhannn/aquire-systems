var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { config } from 'dotenv';
import express from 'express';
import { sequelize } from './DBConnection.js';
//Models
import { User } from './schema/user.js';
import { Enrolls } from './schema/enrolls.js';
import { Student } from './schema/student.js';
import { CurrentSchoolYear } from './schema/currentschoolyear.js';
//Relationship
import './schema/relationship.js';
//Routing
import { AdminModel } from './office/admin/AdminModel.js';
import { AdminContoller } from './office/admin/AdminController.js';
import { PortalModel } from './office/portal/PortalModel.js';
import { PortalContoller } from './office/portal/PortalController.js';
import bodyParser from "body-parser";
import hbs from 'express-hbs';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { GuidanceController } from './office/guidance/GuidanceController.js';
import { GuidanceModel } from './office/guidance/GuidanceModel.js';
class App {
    constructor(express) {
        this.app = null;
        this.userObjects = [];
        this.app = express;
        this.initializeViews();
        this.portalModel = new PortalModel();
        this.portalContoller = new PortalContoller();
        this.portalContoller.bindModel(this.portalModel);
        this.portalContoller.bindToApp(this.app);
    }
    start() {
        this.initializeDatabase();
        this.initializeViews();
        this.app.listen(App.port, () => {
            console.log(`App listening on port ${App.port}`);
            this.app;
        });
    }
    initializeViews() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.use(cookieParser());
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            this.app.engine('hbs', hbs.express4({ partialsDir: __dirname + '../../src/views/partials' }));
            this.app.set('view engine', 'hbs');
            this.app.set('views', (__dirname) + '../../src/views/layouts');
            this.app.use(express.json());
            this.app.use(express.static(__dirname + "../../src/public"));
        });
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sequelize.sync();
                console.log('Database synced successfully');
            }
            catch (error) {
                console.error('Error syncing database:', error);
            }
        });
    }
    addUserModelController(model, controller) {
        controller.bindModel(model);
        controller.bindToApp(this.app);
        this.portalContoller.addUserRoute(controller);
    }
}
App.port = process.env.PORT || 3000;
const app = new App(express());
app.addUserModelController(new AdminModel(), new AdminContoller());
app.addUserModelController(new GuidanceModel(), new GuidanceController());
app.start();
