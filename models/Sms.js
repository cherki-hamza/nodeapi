const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
  address: String,
  body: String,
  date: Date,
  child_id:  String,  // Assuming this is a number based on the Flutter code
  child_name: String,
  parent_id: Number,  // Assuming this is a number as well
  parent_name:String,
});

const Sms = mongoose.model('Sms', smsSchema);

module.exports = Sms;
