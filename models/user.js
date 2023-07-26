
const mongoose = require('mongoose');


const userAuthSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },

});

const UserAuth = mongoose.model('UserAuth', userAuthSchema);

module.exports = UserAuth;

