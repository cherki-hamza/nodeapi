const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: String, // File URL (if stored on a remote server or cloud service)
  public_id: String, // File ID from cloud storage, if applicable
  file_type: String, // Store the MIME type of the file (e.g., image/png, video/mp4)
  original_filename: { type: String, unique: true, required: true }, // Unique original filename
  child_id: String,  // Assuming this is a number based on the Flutter code
  child_name: String,
  parent_id: String,  // Assuming this is a number as well
  parent_name: String,
}, { timestamps: true });

// Create a unique index on original_filename to prevent duplicates
fileSchema.index({ original_filename: 1 }, { unique: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;