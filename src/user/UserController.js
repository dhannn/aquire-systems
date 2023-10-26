import { Router } from "express";

export class UserController {
    startingRoute = null;
    router = null;
    model = null;
    
    constructor(model) {
        this.router = new Router();
        this.model = model;
        this.initializeRoutes();
    }

    createRoute(method, route, action) {
        switch (method) {
            case 'GET':
                this.router.get(route, action.bind(this));
                break;
            case 'POST':
                this.router.post(route, action.bind(this));
                break;
        
            default:
                break;
        }
    }

    bindModel(model) {
        this.model = model;
    }

    bindToApp(app) {
        if (!this.startingRoute) {
            throw new Error('Fill in the starting route in the constructor');
        }

        console.log(this.startingRoute);
        app.use(this.startingRoute, this.router);
    }

    initializeRoutes() {
        throw new Error('Implement initializeRoutes');
    }

    initializeModel() {
        throw new Error('Implement initializeModel');
    }
}