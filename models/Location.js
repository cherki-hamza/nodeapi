const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: { type: String },
  longitude: { type: String },
  child_id: { type: String },
  child_name: { type: String },
  parent_id: { type: Number },
  parent_name: { type: String },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
