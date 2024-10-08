const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  appName: { type: String },
  packageName: { type: String },
  icon: { type: String }, // Base64-encoded icon
  child_id: { type: String },
  child_name: { type: String },
  parent_id: { type: String },
  parent_name: { type: String },
  usageInfo: {
    usageMinutes: { type: Number, default: 0 }, // Store usage time in minutes
    lastTimeUsed: { type: String }, // Store the last time the app was used
  },
});

const App = mongoose.model('App', appSchema);

module.exports = App;