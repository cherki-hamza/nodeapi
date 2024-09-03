const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  file_type: String, // Store the MIME type of the file (e.g., image/png, application/pdf)
  original_filename: String, // Store the original filename before it was uploaded
  child_id:  Number,  // Assuming this is a number based on the Flutter code
  child_name: String,
  parent_id: Number,  // Assuming this is a number as well
  parent_name:String,
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;

