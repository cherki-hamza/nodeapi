const express = require('express');
const { storeCallLogs , getCallLogs , addCallLogs, calllogsCount , checkCallLog } = require('../controllers/callLogController');

const router = express.Router();


// route for store call logs
router.post('/store_calllogs', storeCallLogs);
// route for get all call logs
router.get('/calllogs', getCallLogs);
// route for get the count of contacts
router.get('/calllogs_count', calllogsCount);


router.post('/calllogs', addCallLogs);
router.get('/calllogs/check', checkCallLog);

module.exports = router;