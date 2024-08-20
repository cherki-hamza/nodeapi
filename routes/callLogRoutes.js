const express = require('express');
const { addCallLogs, getCallLogs , checkCallLog } = require('../controllers/callLogController');

const router = express.Router();

router.post('/calllogs', addCallLogs);
router.get('/calllogs', getCallLogs);
router.get('/calllogs/check', checkCallLog);

module.exports = router;