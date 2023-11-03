import { config } from 'dotenv';
import express from 'express';
import { sequelize } from './DBConnection.js';
//Models
import {User}  from'./schema/user.js';
import {Enrolls} from './schema/enrolls.js'
import {Student} from './schema/student.js'
import { AdmissionRecord } from './schema/admissionrecord.js';
import { Record } from './schema/record.js';
//Relationship
import './schema/relationship.js';
//Routing
import { AdminModel } from './user/admin/AdminModel.js';
import { AdminContoller } from './user/admin/AdminController.js';
//Dependencies
import bodyParser from "body-parser";
import  hbs from 'express-hbs';
import path from 'path';
import { fileURLToPath } from 'url';


class App {
    static port = process.env.PORT || 3000;
    app = null;
    
    constructor(express) {
        this.app = express;
    
        this.loadEnv();
        this.initializeViews();
    }
    
    start() {
        this.initializeDatabase();
        this.initializeViews();
        this.app.listen(App.port, () => {
            console.log(`App listening on port ${App.port}`);
            this.app
        });
    }

    loadEnv() {
    }
    
    async initializeViews() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        this.app.engine('hbs', hbs.express4({partialsDir: __dirname + '/views/partials'}));
        this.app.set('view engine', 'hbs');
        this.app.set('views', (__dirname) + '/views/layouts');
        
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
    }
}

const app = new App(express());

app.addUserModelController(new AdminModel(), new AdminContoller())
app.start();
