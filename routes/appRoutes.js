const express = require('express');
const { saveApps } = require('../controllers/appController');

const router = express.Router();

router.post('/save_apps', saveApps);

module.exports = router;
