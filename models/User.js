const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationCode: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
