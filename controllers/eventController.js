// controllers/eventController.js
const Event = require('../models/Event');

exports.saveEvents = async (req, res) => {
  const events = req.body.events;
  let events_count = events.length;

  try {
    // List to hold successfully inserted events
    const newEvents = [];

    let newEventsAdded = false; 
    for (const event of events) {
      // Check if an event with the same title, start, and end time already exists
      const existingEvent = await Event.findOne({
        title: event.title,
        start: event.start,
        end: event.end,
        location: event.location ?? 'empty',
        description: event.description ?? 'empty',
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
        newEventsAdded = true;
      }
    }

    if(newEventsAdded){
      res.status(200).json({
        status: res.statusCode,
        message:'Events saved and processed successfully',
        events_count: events_count,
        data: newEvents,
      });
    }else{
      res.status(res.statusCode).json({
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


// method to get the total count of events
exports.eventsCount = async function (req, res) {
  try {

    const events_count = await Event.countDocuments();
    res.status(200).json({'events_count' : events_count});

  } catch (error) {
    throw new Error('Error getting total Events count: ' + error.message);
  }
};
