import { config } from "dotenv";
import Sequelize from "sequelize";

export class DBConnection {
    connection = null;

    constructor() {
        config();
        
        const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
        this.connection = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
            host: 'localhost',
            dialect: 'mysql'
        });
    }

    async initialize() {
        try {
            await this.connection.sync();
            console.log('Database synced successfully');
        } catch (error) {
            console.error('Error syncing database:', error);
        }
    }

    createNewSchema(schemaName, fields) {
        this.connection.define(schemaName, fields);
    }
}