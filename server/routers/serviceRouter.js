const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { employeeSchemaValidation, serviceSchemaValidation,  } = require('../../schemas');
const ExpressError = require('../../utils/ExpressError');

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

// const validateCreate = (req, res, next) => {
//   const { error } = CreateSchemaValidation.validate(req.body);
//   if (error) {
//     const msg = error.details.map(el => el.message).join(',');
//     throw new ExpressError(msg, 400);
//   } else {
//     next();
//   }
// };


// Define your routes here
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


// Sales Page Routes
router.get('/payrolls/new-servicePage-form', serviceController.newServicePage);
router.get('/payrolls/sales-summary', serviceController.allSales);
router.post('/payrolls/',  serviceController.saveCreateService);

module.exports = router;
