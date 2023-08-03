//imports
const mongoose = require('mongoose');
const Employee = require('../../models/employee');
const Service = require('../../models/service');
const Image = require('../../models/image');
const User = require('../../models/user');
const ServicePage = require ('../../models/servicePage');
const catchAsync = require('../../utils/catchAsync');
const cloudinary = require('../../utils/cloudinary');
const bcrypt = require('bcrypt');







// mongoose
//   .connect("mongodb://127.0.0.1:27017/chicStation")
//   .then(() => {
//     console.log("Connection Open");
//   })
//   .catch((err) => {
//     console.log(err);
//   });


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connection Open');
  })
  .catch((err) => {
    console.log(err);
  });

//login---------------------------------------------------------

//view register page
exports.renderRegisterPage = (req, res) => {
  res.render('admin/register');
};
//save registration
exports.registerUser = catchAsync(async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({ username, email, password: hashedPassword, firstName, lastName });

    await newUser.save();

    // Return a success response
    res.redirect('/');
  } catch (error) {
    // Handle any errors that occur during the registration process
    res.status(500).json({ error: 'Registration failed' });
  }
});



//render login page
exports.renderloginPage = (req, res) => {
  res.render('admin/login');
};

//handle login submition
exports.loginUser = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    // Compare the hashed password using bcrypt.compare()
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      res.status(201).redirect('dashboard');
    } else {
      res.send("Incorrect password");
    }
  } catch (e) {
    res.send("Wrong details");
  }
});





// Define the controller function for rendering the dashboard page
exports.renderDashboardPage = (req, res) => {
  // Retrieve the user object from the request
  const user = req.user;

  res.render('dashboard/home', { user });
};


//logout
exports.logout = (req, res) => {
  res.render('admin/login');
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
  const images = await Image.find({});
  res.status(200).render('images/index', { images });
}

//UPLOAD IMAGe
exports.uploadImage = async (req, res, next) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    let image = new Image({
      title: req.body.title,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save user
    await image.save();
    res.redirect('/images');
  } catch (err) {
    console.log(err);
  }
};



//DELETE UPLOAD IMAGE
exports.deleteImage = async (req, res, next) => {
  try {
    // Fetch image from Cloudinary
    const image = await Image.findById(req.params.id);

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(image.cloudinary_id);

    // Delete image from the database
    await Image.findByIdAndRemove(req.params.id);

    res.redirect('/images');
  } catch (err) {
    console.log(err);
  }
};



/** -------------------------------------------                    */
// ROUTE TO SERVICEPAGE
// View add ServicePage form
exports.newServicePage = async (req, res) => {
  const services = await Service.find();
  const employees = await Employee.find();
  res.status(200).render('staffSale/servicePage', { services: services, employees: employees });
}

//Display all SALES SUMMARY
exports.getSalesSummary = async (req, res) => {
  try {
    const salesSummary = await ServicePage.find().populate('services.service services.staff').exec();

    // Calculate additional data
    const staffSalesData = {};

    salesSummary.forEach((servicePage) => {
      servicePage.services.forEach((service) => {
        const staffId = service.staff._id.toString();

        if (!staffSalesData[staffId]) {
          staffSalesData[staffId] = {
            staff: service.staff.employeeName.employeeFName,
            totalCustomers: new Set(),
            totalSales: 0,
            services: [], // Add an empty array to store services per staff
          };
        }

        // Calculate total customers per staff
        staffSalesData[staffId].totalCustomers.add(servicePage.customerName);

        // Calculate total sales per staff
        staffSalesData[staffId].totalSales += service.total;

        // Store service per staff in each customer
        staffSalesData[staffId].services.push({
          customerName: servicePage.customerName,
          serviceName: service.service.serviceName,
          price: service.price,
          qty: service.qty,
          disc: service.disc,
        });
      });
    });

    const staffSalesArray = Object.values(staffSalesData);

    res.render('staffSale/transactions', { salesSummary, staffSalesArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the sales summary data' });
  }
};



/*-----=========================================---*/
// Save new service
exports.CreateService = async (req, res) => {
  const { date, customerName, subTotal, grandTotal, services } = req.body;

  // Create a new service page instance
  const servicePage = new ServicePage({
    date,
    customerName,
    subTotal,
    grandTotal,
    services,
  });

  try {
    // Explicitly validate the data
    await servicePage.validate();

    // Save the service page to the database
    await servicePage.save();

    // Send a response back to the client
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors
      console.error(error);
      res.status(400).json({ error: 'Invalid data format', details: error.errors });
    } else {
      // Handle other errors
      console.error(error);
      res.status(500).json({ error: 'An error occurred while saving the data' });
    }
  }
};


















