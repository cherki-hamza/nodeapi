const express = require('express');
const { addCallLogs, getCallLogs } = require('../controllers/callLogController');

const router = express.Router();

router.post('/calllogs', addCallLogs);
router.get('/calllogs', getCallLogs);

module.exports = router;

