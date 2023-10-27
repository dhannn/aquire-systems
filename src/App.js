import { config } from 'dotenv';
import express from 'express';
import { DBConnection } from './DBConnection.js';
import { AdminModel } from './user/admin/AdminModel.js';
import { AdminContoller } from './user/admin/AdminController.js';

class App {
    static port = process.env.PORT || 3000;
    app = null;
    
    constructor(express, dbConnection) {
        this.app = express;
        this.dbConnection = dbConnection;

        this.loadEnv()
        this.initializeViews;
        this.initializeUsers();
    }
    
    start() {
        this.dbConnection.initialize();
        this.app.listen(App.port, () => {
            console.log(`App listening on port ${App.port}`);
            this.app
        });
    }

    loadEnv() {
    }
    
    initializeViews() {
        
    }

    initializeUsers() {
        const adminModel = new AdminModel();
        const adminController = new AdminContoller(adminModel);
        adminController.bindToApp(this.app);
    }
}

const app = new App(express(), new DBConnection());
app.start();
