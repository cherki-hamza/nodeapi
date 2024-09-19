// controllers/eventController.js
const Event = require('../models/Event');

exports.saveEvents = async (req, res) => {
  const events = req.body.events;

  try {
    // List to hold successfully inserted events
    const newEvents = [];

    for (const event of events) {
      // Check if an event with the same title, start, and end time already exists
      const existingEvent = await Event.findOne({
        title: event.title,
        start: event.start,
        end: event.end,
        child_id: event.child_id,
        child_name: event.child_name,
        parent_id: event.parent_id,
        parent_name: event.parent_name,
      });

      // If the event does not exist, insert it
      if (!existingEvent) {
        const newEvent = new Event(event);
        await newEvent.save();
        newEvents.push(newEvent); // Add successfully saved event to the list
      }
    }

    if(newEvents){
      res.status(200).json({
        message: 'Events saved successfully',
        data: newEvents,
      });
    }else{
      res.status(200).json({
        message: 'Oops there is no new events its allraedy updated',
      });
    }

    
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
