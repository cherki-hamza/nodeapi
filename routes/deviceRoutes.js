const express = require('express');
const { getDeviceDataByParentId , testdata } = require('../controllers/deviceController');

const router = express.Router();


// route for get the device data by parent id
router.get('/:parentId', getDeviceDataByParentId);

// test data
router.get('/:parentId/data', testdata);

module.exports = router;

