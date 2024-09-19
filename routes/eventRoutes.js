// routes/eventRoutes.js
const express = require('express');
const { saveEvents , getEvents } = require('../controllers/eventController');

const router = express.Router();

// POST route to save events
router.post('/store_events', saveEvents);

// GET route to fetch events (optional)
router.get('/get_events', getEvents);

module.exports = router;
