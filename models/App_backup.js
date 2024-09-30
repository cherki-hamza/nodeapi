const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  appName: { type: String },
  packageName: { type: String },
  icon: { type: String },
  child_id: { type: String },
  child_name: { type: String },
  parent_id: { type: String },
  parent_name: { type: String },
});

const App = mongoose.model('App', appSchema);

module.exports = App;
