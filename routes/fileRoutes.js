const express = require('express');
const { uploadFile, uploadMultipleFiles , storeFiles } = require('../controllers/fileController');

const router = express.Router();

// Route for store files
router.post('/store_files', storeFiles);

// Route for single file upload
router.post('/upload', uploadFile);

// Route for multiple file uploads
router.post('/upload-multiple', uploadMultipleFiles);

module.exports = router;

