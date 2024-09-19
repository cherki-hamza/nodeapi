// controllers/eventController.js
const Event = require('../models/Event');

// Save calendar events to MongoDB
exports.saveEvents = async (req, res) => {
  const events = req.body.events;

  try {
    const savedEvents = await Event.insertMany(events);
    res.status(200).json({ message: 'Events saved successfully', data: savedEvents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save events', error });
  }
};

// Fetch all calendar events from MongoDB (for example)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error });
  }
};
