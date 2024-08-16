const express = require('express');
const { checkSmsExists, receiveSms, getSms } = require('../controllers/smsController');

const router = express.Router();

router.post('/check-sms-exists', checkSmsExists);
router.post('/receive-sms', receiveSms);
router.get('/get_sms', getSms);

module.exports = router;
