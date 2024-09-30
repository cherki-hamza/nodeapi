const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  name: String,
  number: String,
  callType: String,
  duration: Number,
  timestamp: Date,
  child_id:  String,  // Assuming this is a number based on the Flutter code
  child_name: String,
  parent_id: String,  // Assuming this is a number as well
  parent_name:String,
});

const CallLog = mongoose.model('CallLog', callLogSchema);

module.exports = CallLog;

