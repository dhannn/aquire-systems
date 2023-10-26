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
        this.app.use(bodyParser.urlencoded({extended: true}));
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        this.app.engine('hbs', hbs.express4({partialsDir: __dirname + '/views/partials'}));
        this.app.set('view engine', 'hbs');
        this.app.set('views', (__dirname) + '/views/layouts');
        
        this.app.use(express.static(__dirname + "/public"));
    }

    addUserModelController(model, controller) {
        controller.bindModel(model);
        controller.bindToApp(this.app);
    }
}

const app = new App(express(), new DBConnection());

app.addUserModelController(new AdminModel(), new AdminContoller())
app.start();
