//imports
const mongoose = require('mongoose');
const Employee = require('../../models/employee');
const Service = require('../../models/service');
const Image = require('../../models/image');
const ServicePage = require('../../models/servicePage');
const User = require('../../models/user');
const UserRegistration = require('../../models/userRegistration');
// const Payroll = require('../../models/payroll');
const catchAsync = require('../../utils/catchAsync');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');




const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });


mongoose
  .connect("mongodb://127.0.0.1:27017/chicStation")
  .then(() => {
    console.log("Connection Open");
  })
  .catch((err) => {
    console.log(err);
  });



//login---------------------------------------------------------
// Import any necessary modules

// Define the controller function for rendering the login page
exports.renderLoginPage = (req, res) => {
  res.render('admin/login');
};

exports.renderRegisterPage = (req, res) => {
  res.render('admin/register');
};
// Define the controller function for rendering the dashboard page
exports.renderDashboardPage = (req, res) => {
  res.render('/dashboard');
};

// Define the middleware function to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
  // Check if the user is authenticated
  // You can implement your authentication logic here

  // If the user is authenticated, proceed to the next middleware or route handler
  // If the user is not authenticated, redirect them to the login page
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};







// display all records--------------------------------------------------
exports.allRecords = async (req, res) => {
  const records = await Employee.find({});
  res.status(200).render('records/index', { records });
}

// view specific record
exports.viewRecord = catchAsync(async (req, res) => {
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
exports.updateRecordForm = catchAsync(async (req, res) => {
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
exports.deleteRecord = catchAsync(async (req, res) => {
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
exports.saveService = catchAsync(async (req, res) => {
  const service = new Service(req.body.service);
  await service.save();
  res.redirect('/payrolls');


})

//View update Service form
exports.updateServiceForm = catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  const service = await Service.findById(serviceId);
  res.status(200).render('payrolls/editService', { service });

})

//update Service Form
exports.updateService = catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  const service = await Service.findByIdAndUpdate(serviceId, { ...req.body.service });
  res.redirect('/payrolls');

})
// Delete record form
exports.deleteService = catchAsync(async (req, res) => {
  const serviceId = req.params.id;
  await Service.findByIdAndDelete(serviceId);
  res.redirect('/payrolls');
})
/** -------------------------------------------                    */
//View upload images
exports.viewImage = async (req, res) => {
  const images = await Image.find();
  res.status(200).render('images/index', { images });

};
//UPLOAD IMAGe
exports.uploadImage = async (req, res, next) => {
  try {
    const images = req.files.map(file => new Image({
      imageUrl: file.path,
      altText: req.body.altText,
      notes: req.body.notes,
    }));

    for (const image of images) {
      await image.save();
    }

    // Retrieve all images from the database
    const allImages = await Image.find();

    res.redirect('/images'); // Redirect to the appropriate URL

  } catch (error) {
    next(error);
  }
};

//DELETE UPLOAD IMAGE

exports.deleteImage = catchAsync(async (req, res) => {
  const imageId = req.params.id;
  const image = await Image.findById(imageId);
  // If the image is found in the database, delete it from both the database and the "uploads" folder
  if (image) {
    await Image.findByIdAndDelete(imageId);

    fs.unlinkSync(image.imageUrl); 

    res.redirect('/images');
  } else {
    
  }
});

















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















