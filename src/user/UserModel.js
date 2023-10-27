export class UserModel {
    dbConnection = null;

    initializeTables() {
        throw new Error('Implement initializeTable');
    }

    bindDB(dbConnection) {
        this.dbConnection = dbConnection;
        this.initializeTables();
    }
}