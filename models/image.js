const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
      required: true
    },
    notes: {
        type: String,
        required: true
    }
  });
  
  const Image = mongoose.model('Image', imageSchema);
  
  module.exports = Image;