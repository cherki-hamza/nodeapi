const express = require('express');
const { saveLocation , getLocations , locationsCount } = require('../controllers/locationController');

const router = express.Router();


// route for store locations
router.post('/store_location', saveLocation);

// route for get locations
router.get('/get_locations', getLocations);

// get the locations count locationsCount
router.get('/count_locations', locationsCount);


module.exports = router;
