const mongoose = require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const UserRegistration = mongoose.model('UserRegistration', userRegistrationSchema);

module.exports = UserRegistration;
