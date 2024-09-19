const express = require('express');
const { saveApps , getApps } = require('../controllers/appController');

const router = express.Router();


// POST route for store apps
router.post('/save_apps', saveApps);

// GET route to fetch apps
router.get('/get_apps', getApps);

module.exports = router;
