const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { employeeSchemaValidation, serviceSchemaValidation   } = require('../../schemas');
const ExpressError = require('../../utils/ExpressError');
const upload = require('../../middleware/multermiddleware'); 


// Middlewares
const validateEmployee = (req, res, next) => {
  const { error } = employeeSchemaValidation.validate(req.body.employeeName);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


const validateService = (req, res, next) => {
  const { error } = serviceSchemaValidation.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};



// const validateImage = (req, res, next) => {
//   const { error } = imageSchemaValidation.validate(req.body);
//   if (error) {
//     const msg = error.details.map((el) => el.message).join(',');
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };




// Define your routes here

//login render
router.get('/admin', serviceController.renderLoginPage);
router.get('/dashboard', serviceController.isAuthenticated, serviceController.renderDashboardPage);
router.get('/admin/register-form', serviceController.renderRegisterPage);




// Employee Routes
router.get('/records', serviceController.allRecords);
router.get('/records/new-record-form', serviceController.newRecordForm);
router.post('/records', validateEmployee, serviceController.saveRecord);
router.get('/records/:id', serviceController.viewRecord);
router.get('/records/:id/update-record', serviceController.updateRecordForm);
router.put('/records/:id', validateEmployee, serviceController.updateRecord);
router.delete('/records/:id', serviceController.deleteRecord);

// Services Routes
router.get('/payrolls', serviceController.allServices);
router.get('/payrolls/new-service-form', serviceController.newServiceForm);
router.post('/payrolls', validateService, serviceController.saveService);
router.get('/payrolls/:id/update-service', serviceController.updateServiceForm);
router.put('/payrolls/:id', validateService, serviceController.updateService);
router.delete('/payrolls/:id', serviceController.deleteService);

//upload image

router.get('/images', serviceController.viewImage);
router.post('/images', upload.array('image'), serviceController.uploadImage);
router.delete('/images/:id', serviceController.deleteImage);





// Sales Page Routes
router.get('/payrolls/new-servicePage-form', serviceController.newServicePage);
router.get('/payrolls/sales-summary', serviceController.allSales);
router.post('/payrolls/',  serviceController.saveCreateService);

module.exports = router;
