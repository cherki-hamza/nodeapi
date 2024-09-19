// models/eventModel.js
const mongoose = require('mongoose');

// Define the Event schema
const eventSchema = new mongoose.Schema({
  title:        { type: String },
  start:        { type: Date },
  end:          { type: Date },
  child_id:     { type: String },
  child_name:   { type: String },
  parent_id:    { type: String },
  parent_name:  { type: String },
});

// Create and export the Event model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
