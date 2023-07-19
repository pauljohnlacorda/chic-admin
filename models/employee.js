const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeName: {
    employeeFName: {
      type: String,
      required: true
    },
    employeeLName: {
      type: String,
      required: true
    },
    employeeMidName: {
      type: String,
      required: true
    },
  },
  
  civilStatus: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  employeeAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    postalCode: {
      type: Number,
      required: true
    },
  },
  contactNum: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  // Other relevant fields
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
