import { config } from 'dotenv';
import express from 'express';
import { sequelize } from './DBConnection.js';
//Models
import {User}  from'./schema/user.js';
import {Enrolls} from './schema/enrolls.js'
import {Student} from './schema/student.js'
import { CurrentSchoolYear } from './schema/currentschoolyear.js';
//Relationship
import './schema/relationship.js';
//Routing
import { AdminModel } from './user/admin/AdminModel.js';
import { AdminContoller } from './user/admin/AdminController.js';
import { PortalModel } from './user/portal/PortalModel.js';
import { PortalContoller } from './user/portal/PortalController.js';
import bodyParser from "body-parser";
import  hbs from 'express-hbs';
import cookieParser from 'cookie-parser';

import path from 'path';
import { fileURLToPath } from 'url';
import { GuidanceController } from './user/guidance/GuidanceController.js';
import { GuidanceModel } from './user/guidance/GuidanceModel.js';


class App {
    static port = process.env.PORT || 3000;
    app = null;
    userObjects = [];
    
    constructor(express) {
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
            this.app
        });
    }
    
    async initializeViews() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cookieParser());
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        this.app.engine('hbs', hbs.express4({partialsDir: __dirname + '/views/partials'}));
        this.app.set('view engine', 'hbs');
        this.app.set('views', (__dirname) + '/views/layouts');

        this.app.use(express.json());

        
        this.app.use(express.static(__dirname + "/public"));
    }

    async initializeDatabase(){
        try {
            await sequelize.sync();
            console.log('Database synced successfully');
          } catch (error) {
            console.error('Error syncing database:', error);
          }
    }

    addUserModelController(model, controller) {
        controller.bindModel(model);
        controller.bindToApp(this.app);
        this.portalContoller.addUserRoute(controller);
    }
}

const app = new App(express());

app.addUserModelController(new AdminModel(), new AdminContoller());
app.addUserModelController(new GuidanceModel(), new GuidanceController());
app.start();
