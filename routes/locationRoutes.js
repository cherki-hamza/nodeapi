const express = require('express');
const { saveLocation , getLocations } = require('../controllers/locationController');

const router = express.Router();


// route for store locations
router.post('/store_location', saveLocation);

// route for get locations
router.get('/get_locations', getLocations);

module.exports = router;
