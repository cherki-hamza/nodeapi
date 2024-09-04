const express = require('express');
const router = express.Router();
const { storeSms , checkSmsExists, receiveSms, getSms } = require('../controllers/smsController');

// route for store the sms
router.post('/store_sms', storeSms);

router.post('/check-sms-exists', checkSmsExists);
router.post('/receive-sms', receiveSms);
router.get('/get_sms', getSms);


module.exports = router;
