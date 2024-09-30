const express = require('express');
const router = express.Router();
const { storeSms ,  smsCount  , checkSmsExists, receiveSms, getSms } = require('../controllers/smsController');

// route for store the sms
router.post('/store_sms', storeSms);

// sms count
router.get('/sms_count', smsCount);

router.post('/check-sms-exists', checkSmsExists);
router.post('/receive-sms', receiveSms);
router.get('/get_sms', getSms);


module.exports = router;
