const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
  address: String,
  body: String,
  date: Date,
});

const Sms = mongoose.model('Sms', smsSchema);

module.exports = Sms;
