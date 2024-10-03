const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
  address: String,
  body: String,
  date: Date,
  child_id:  String,  // Assuming this is a number based on the Flutter code
  child_name: String,
  parent_id: String,  // Assuming this is a number as well
  parent_name:String,
  type: String // This will store 'incoming' or 'outgoing'
});

const Sms = mongoose.model('Sms', smsSchema);

module.exports = Sms;
