const express = require('express');
const { saveApps , getApps , appsCount } = require('../controllers/appController');

const router = express.Router();


// POST route for store apps
router.post('/save_apps', saveApps);

// GET route to fetch apps
router.get('/get_apps', getApps);

// get the apps count
router.get('/count_apps', appsCount);

module.exports = router;
