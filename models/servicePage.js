const mongoose = require('mongoose');

const servicePageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  subTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  services: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
      },
      staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      qty: {
        type: Number,
        required: true,
        min: 1,
      },
      disc: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      total: {
        type: Number,
        required: true,
        
      },
    },
  ],
});

// Define a model based on the schema
const ServicePage = mongoose.model('ServicePage', servicePageSchema);

module.exports = ServicePage;
