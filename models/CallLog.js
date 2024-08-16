const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  name: String,
  number: String,
  callType: String,
  duration: Number,
  timestamp: Date,
});

const CallLog = mongoose.model('CallLog', callLogSchema);

module.exports = CallLog;

