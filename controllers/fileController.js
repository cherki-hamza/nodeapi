const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const File = require('../models/File');


// method for store files
exports.storeFiles = async (req, res) => {
  try {
    const files = req.body.files; // Expecting an array of file objects

    if (!Array.isArray(files)) {
      return res.status(400).json({ error: 'Files must be an array.' });
    }

    const savedFiles = [];
    const duplicateFiles = [];

    for (const file of files) {
      // Check if a file with the same original_filename exists
      const existingFile = await File.findOne({ original_filename: file.original_filename });

      if (existingFile) {
        duplicateFiles.push(file.original_filename); // Collect duplicates
      } else {
        // Save the new file if no duplicates found
        const newFile = new File({
          ...file, // Save all fields
          url: file.url, // url field contains base64 data
        });
        const savedFile = await newFile.save();
        savedFiles.push(savedFile);
      }
    }

    res.status(200).json({
      message: 'File processing complete!',
      savedFiles, // List of files that were stored
      duplicateFiles, // List of duplicate filenames that were ignored
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to store files.' });
  }
};


// Multer setup for handling file uploads
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to include timestamp
  },
});

// Adjust file size limit if necessary
const singleUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
}).single('file'); // Single file upload with the field name 'file'

const multipleUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB per file
}).array('files', 1000); // Multiple file upload with the field name 'files' (up to 10 files)

// Single file upload controller method
exports.uploadFile = (req, res) => {
  singleUpload(req, res, async (err) => {
    if (err) {
      console.log('Multer Error:', err);
      return res.status(400).json({ error: 'Error uploading file', details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or incorrect form-data key' });
    }

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto", // This allows Cloudinary to auto-detect file type
        folder: 'vigil', // Optional: Define a folder in Cloudinary
      });

      const file = new File({
        url: result.secure_url,
        public_id: result.public_id,
        file_type: req.file.mimetype,
        original_filename: result.original_filename,
      });

      await file.save();

      res.status(200).json({
        message: 'File uploaded and saved successfully',
        file,
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary or saving to MongoDB:', error);
      res.status(500).json({ error: 'Error uploading to Cloudinary', details: error.message });
    }
  });
};

// Multiple file upload controller method
exports.uploadMultipleFiles = (req, res) => {
  multipleUpload(req, res, async (err) => {
    if (err) {
      console.log('Multer Error:', err);
      return res.status(400).json({ error: 'Error uploading files', details: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded or incorrect form-data key' });
    }

    try {
      const uploadResults = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: "auto", // This allows Cloudinary to auto-detect file type
            folder: 'vigil', // Optional: Define a folder in Cloudinary
          })
        )
      );

      const fileSavePromises = uploadResults.map((result, index) => {
        const file = new File({
          url: result.secure_url,
          public_id: result.public_id,
          file_type: req.files[index].mimetype,
          original_filename: result.original_filename,
        });

        return file.save();
      });

      await Promise.all(fileSavePromises);

      res.status(200).json({
        message: 'Files uploaded and saved successfully',
        files: uploadResults,
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary or saving to MongoDB:', error);
      res.status(500).json({ error: 'Error uploading to Cloudinary', details: error.message });
    }
  });
};
