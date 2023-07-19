const mongoose = require('mongoose');

const servicePageSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true
  },
  staffId: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  disc: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('ServicePage', servicePageSchema);