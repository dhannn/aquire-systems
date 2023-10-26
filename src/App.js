import { config } from 'dotenv';
import express from 'express';
import { DBConnection } from './DBConnection.js';

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
    }

    loadEnv() {
        config();
    }
    
    initializeViews() {
    }

    initializeUsers() {

    }
}

const app = new App(express(), new DBConnection());
app.start();
