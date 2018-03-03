const mongoose = require('mongoose');

const User = mongoose.model('User', {
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  age: { type: Number, required: true },
  token: { type: String, required: false },
});

module.exports = User;
