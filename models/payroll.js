const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  customerName: String,
  subTotal: Number,
  grandTotal: Number,
  services: [{
    service: String,
    staff: String,
    price: Number,
    qty: Number,
    disc: Number,
    total: Number
  }]
});

// Create a model for the payroll
const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll;
