// routes/eventRoutes.js
const express = require('express');
const { saveEvents , getEvents , eventsCount } = require('../controllers/eventController');

const router = express.Router();

// POST route to save events
router.post('/store_events', saveEvents);

// GET route to fetch events (optional)
router.get('/get_events', getEvents);

// route for get the count of events
router.get('/events_count', eventsCount);

module.exports = router;
