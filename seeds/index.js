const mongoose = require("mongoose");
const Employee = require("../models/employee");

mongoose
  .connect("mongodb://127.0.0.1:27017/chicStation")
  .then(() => {
    console.log("Connection Open");
    seedDB();
  })
  .catch((err) => {
    console.log(err);
  });

const seedDB = async () => {
  await Employee.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const employee = new Employee({
      employeeName: {
        employeeFName: "John",
        employeeLName: "Doe",
        employeeMidName: "Doll",
      },
      civilStatus: "married",
      birthDate: new Date('2023-01-01'),
      employeeAddress: {
        street: "51ST Street",
        city: "Davao",
        region: "Region Name",
        postalCode: 8000,
      },
      contactNum: 99999999,
      position: "Manager",
      startDate: new Date('2023-01-01'),
    });
    await employee.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})
