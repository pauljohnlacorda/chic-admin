const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({
    cloudinary_id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    avatar: {
        type: String,
        required: true
    }
  });
  
  const Image = mongoose.model('Image', imageSchema);
  
  module.exports = Image;