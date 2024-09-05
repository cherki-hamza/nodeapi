const express = require('express');
const { saveLocation } = require('../controllers/locationController');

const router = express.Router();

router.post('/store_location', saveLocation);

module.exports = router;
