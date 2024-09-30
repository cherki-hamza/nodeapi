const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  displayName: String,
  phones: Array,
  child_id: String,
  child_name: String,
  parent_id: String,
  parent_name: String,
});

const Contacts = mongoose.model('Contacts', contactSchema);

module.exports = Contacts;
