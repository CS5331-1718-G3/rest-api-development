const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    age: { type: Number, required: true },
    token: { type: String, required: false },
  },
  { versionKey: false }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
