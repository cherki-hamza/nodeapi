const express = require('express');
const { saveLocation } = require('../controllers/locationController');

const router = express.Router();

router.post('/locations', saveLocation);

module.exports = router;
