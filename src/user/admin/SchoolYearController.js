// const { Router } = require('express');

// class SchoolYearController {
//   constructor(model) {
//     this.router = Router();
//     this.model = model;
//     this.initializeRoutes();
//   }

//   createRoute(method, route, action) {
//     switch (method) {
//       case 'GET':
//         this.router.get(route, action.bind(this));
//         break;
//       default:
//         break;
//     }
//   }

//   bindModel(model) {
//     this.model = model;
//   }

//   bindToApp(app) {
  
//     app.use('/', this.router);
//   }

//   initializeRoutes() {
    
//     this.createRoute('GET', '/startSchoolYear', this.signalNewSchoolYear);
//   }


//   signalNewSchoolYear(req, res) {
//     try {

//       const currentYear = new Date().getFullYear();
//       const newSchoolYear = `${currentYear}-${currentYear + 1}`;

      
//       res.render('Admin_Student', {
//         message: {
//           isSuccess: true,
//           content: `New school year ${newSchoolYear} has been signaled.`,
//         },
//       });
//     } catch (error) {
//       console.error('Error signaling a new school year:', error);

     
//       res.render('Admin_Student', {
//         message: {
//           isSuccess: false,
//           content: 'Failed to signal a new school year.',
//         },
//       });
//     }
//   }
// }

// module.exports = SchoolYearController;