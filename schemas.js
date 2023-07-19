const Joi = require('joi');

module.exports.employeeSchemaValidation = Joi.object({
  employeeName: Joi.object({
    employeeFName: Joi.string().required(),
    employeeLName: Joi.string().required(),
    employeeMidName: Joi.string().required()
  }).required(),
  civilStatus: Joi.string().required(),
  birthDate: Joi.date().required(),
  employeeAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    region: Joi.string().required(),
    postalCode: Joi.number().required()
  }).required(),
  contactNum: Joi.number().required(),
  position: Joi.string().required(),
  startDate: Joi.date().required()
  
});

module.exports.serviceSchemaValidation = Joi.object({
  service: Joi.object({
    category:Joi.string().required(),
    serviceName: Joi.string().required(),
    price: Joi.number().required()
  }).required()
});


// module.exports.CreateSchemaValidation = Joi.object({
  
//   services: Joi.array().items(
//     Joi.object({
//       customerName: Joi.string().required(),
//       service: Joi.string().required(),
//       staff: Joi.string().required(),
//       price: Joi.number(),
//       qty: Joi.number().required(),
//       disc: Joi.number().required(),
//       total: Joi.number(),
//       subTotal: Joi.number(),
//      grandTotal: Joi.number(),
//     })
//   ).required(),
  
// });


