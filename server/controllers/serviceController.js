//imports
const mongoose = require('mongoose');
const Employee = require('../../models/employee');
const Service = require('../../models/service');
const ServicePage = require('../../models/servicePage');
const Payroll = require('../../models/payroll');
const catchAsync = require('../../utils/catchAsync');



mongoose
  .connect("mongodb://127.0.0.1:27017/chicStation")
  .then(() => {
    console.log("Connection Open");
  })
  .catch((err) => {
    console.log(err);
  });

// display all records
exports.allRecords = async (req, res) => {
  const records = await Employee.find({});
  res.status(200).render('records/index', { records });
}

// view specific record
exports.viewRecord = catchAsync (async(req, res) => {
    const recordId = req.params.id;
    const employee = await Employee.findById(recordId);
    res.status(200).render('records/show', { employee });
})
 
// View New record form
exports.newRecordForm = (req, res) => {
  res.status(200).render('records/add');
}

// Save New record Form
exports.saveRecord = catchAsync(async (req, res) => {
  const newRecord = new Employee(req.body.employee);
  await newRecord.save();
  res.redirect(`/records/${newRecord._id}`);
})

// View update record form
exports.updateRecordForm = catchAsync( async (req, res) => {
  const recordId = req.params.id;
  const record = await Employee.findById(recordId);
  res.status(200).render('records/edit', { employee: record });

})

// update Record Form
exports.updateRecord = catchAsync(async (req, res) => {
  const recordId = req.params.id;
  const record = await Employee.findByIdAndUpdate(recordId, { ...req.body.employee });
  res.redirect(`/records/${recordId}`);
});


// Delete record form
exports.deleteRecord =  catchAsync(async (req, res) => {
  const recordId = req.params.id;
  await Employee.findByIdAndDelete(recordId);
  // Additional logic for deleting related revisions
  res.redirect('/records');
})
 

//route to Services

/// display all Services
exports.allServices = async (req, res) => {
  const services = await Service.find({});
  res.status(200).render('payrolls/index', { services });
}

// View add Services form
exports.newServiceForm = (req, res) => {
  res.status(200).render('payrolls/addService');
}

// Save New Servces 
exports.saveService =  catchAsync(async (req, res) => {
  const service = new Service(req.body.service);
  await service.save();
  res.redirect('/payrolls');

  // res.redirect(`/payrolls/${service._id}`);
  
})

//View update Service form
exports.updateServiceForm = catchAsync (async (req, res) => {
  const serviceId = req.params.id;
  const  service = await Service.findById(serviceId);
  res.status(200).render('payrolls/editService',{service});

})

//update Service Form
exports.updateService =catchAsync (async(req, res) => {
  const serviceId = req.params.id;
  const  service  = await Service.findByIdAndUpdate(serviceId, {...req.body.service});
  res.redirect('/payrolls');

})
// Delete record form
exports.deleteService =  catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  await Service.findByIdAndDelete(serviceId);
  res.redirect('/payrolls');
})


/** -------------------------------------------                    */
// ROUTE TO SERVICEPAGE
// View add ServicePage form
exports.newServicePage = async (req, res) => { 
    const services = await Service.find();
    const employees = await Employee.find();
    res.status(200).render('payrolls/servicePage', { services: services, employees: employees });     
}

// Display all SALES SUMMARY
exports.allSales = async (req, res) => {
  const sales = await ServicePage.find({}); 
  res.status(200).render('payrolls/staffSale', { sales });
};


// Save new service
exports.saveCreateService = catchAsync(async (req, res) => {
  const { serviceId, staffId, qty, disc, total } = req.body;

  try {
    // Retrieve the service and employee data based on the provided IDs
    const service = await Service.findById(serviceId);
    const employee = await Employee.findById(staffId);

    if (!service || !employee) {
      return res.status(404).json({ error: 'Service or employee not found' });
    }

    // Create a new document with the retrieved data
    const newData = {
      service: service.serviceName,
      employee: employee.employeeName,
      price: service.price,
      qty,
      disc,
      total
    };

    // Create a new instance of the ServicePage model
    const newServicePage = new ServicePage(newData);

    // Save the new service page data to the database
    await newServicePage.save();

    // Redirect or send a response to indicate success
    res.redirect(`/payrolls/${newServicePage._id}`);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});















