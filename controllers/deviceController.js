const App = require('../models/App');
const Sms = require('../models/Sms');
const CallLog = require('../models/CallLog');
const Contacts = require('../models/Contact');
const mongoose = require('mongoose');
const Location = require('../models/Location');
const Event = require('../models/Event');

const getDeviceDataByParentId = async (req, res) => {
  try {
    const parentId = req.params.parentId; // Get the parent_id from the URL

    // Fetch distinct child names associated with the parent_id
    const children = await App.distinct('child_name', { parent_id: parentId });

    if (!children || children.length === 0) {
      return res.status(404).json({ message: 'No data found for this parent_id.' });
    }

    const deviceData = {
      parentId: parentId,
      children: {},
    };

    // Loop through each child and gather data from various collections
    for (const child of children) {
      const [apps, callLogs, smsLogs, contacts, locations] = await Promise.all([
        App.find({ child_name: child, parent_id: parentId }),
        CallLog.find({ child_name: child, parent_id: parentId }),
        Sms.find({ child_name: child, parent_id: parentId }),
        Contacts.find({ child_name: child, parent_id: parentId }),
        Location.find({ child_name: child, parent_id: parentId }), // Fetch all locations for this child
      ]);

      // Format app usage data from `App` model's `usageInfo`
      const appUsage = apps.length > 0 ? apps.map((app) => ({
        icon: app.icon || 'default-icon.png', // Default icon if not found
        name: app.appName || 'Unknown App',
        time: app.usageInfo ? `${Math.floor(app.usageInfo.usageMinutes / 60)}H ${app.usageInfo.usageMinutes % 60}M` : '0H 0M', // Default usage time
      })) : [];

      // Format call logs
      const totalCallDuration = callLogs.reduce((acc, log) => acc + log.duration, 0);
      const callLogsData = {
        count: callLogs.length || 0,
        duration: callLogs.length > 0 ? `${Math.floor(totalCallDuration / 60)}H ${totalCallDuration % 60}M` : '0H 0M',
      };

      // Format SMS logs
      const smsLogsData = {
        incoming: smsLogs.filter((sms) => sms.body.startsWith('Incoming')).length || 0,
        outgoing: smsLogs.filter((sms) => sms.body.startsWith('Outgoing')).length || 0,
      };

      // Format contacts data
      const contactsData = {
        total: contacts.length || 0,
        new: contacts.length || 0, // Assuming no distinction between total/new
      };

      // Placeholder for data that doesn't exist (keylogger, photos, videos)
      const keyloggerData = []; // No data available, use empty array
      const photosData = { count: 50, new: 10 }; // Placeholder data
      const videosData = { count: 15, new: 2 };  // Placeholder data
      const callRecordingsData = { total: 25, new: 5 }; // Placeholder data

      // Format location data (fetching all locations associated with the child)
      const locationData = locations.length > 0 ? locations.map(loc => ({
        coordinates: loc.coordinates,
        type: loc.type || 'Unknown',
        timestamp: loc.createdAt || new Date(), // Assuming `createdAt` holds the timestamp
      })) : []; // Return empty array if no locations exist

      // Fetch events for the child
      const events = await Event.find({ child_name: child, parent_id: parentId });
      const formattedEvents = events.map(event => ({
        title: event.title || 'Untitled Event',
        start: event.start || new Date(),
        end: event.end || new Date(),
        location: event.location || 'Unknown Location',
        description: event.description || 'No Description',
      }));

      // Populate the device data for each child
      deviceData.children[child] = {
        name: child,
        device: apps.length > 0 ? apps[0].packageName : 'Unknown Device',
        battery: 'Unknown', // You may need to fetch this from another source
        appUsage,            // Add app usage data here
        callLogs: callLogsData,
        smsLogs: smsLogsData,
        photos: photosData,  // Placeholder photos data
        videos: videosData,  // Placeholder videos data
        callRecordings: callRecordingsData, // Placeholder call recordings data
        contacts: contactsData,
        location: locationData,   // Location data array for all locations
        events: formattedEvents,
        // Add callRecordings and keylogger placeholders
        callRecordings: { total: 25, new: 5 }, // Placeholder call recordings data
        keylogger: [
          { content: 'Search for Flutter tips', app: 'Google', date: '07-01-2024', time: '4:00 pm' },
          { content: 'Message to mom', app: 'WhatsApp', date: '07-01-2024', time: '4:30 pm' },
        ],
      };
    }

    res.json(deviceData); // Return the entire deviceData object, including child data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Test data function, updated similarly
const testdata = async(req,res) => {
  const parentId = req.params.parentId;

  const parentDB = mongoose.createConnection(process.env.MONGO_PARENT_URI);

  // Child model - register with childDB connection
  const childSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: { type: String }, coordinates: [Number] },
    deviceName: { type: String, default: '' },
    batteryOptimizationAllowed: { type: Boolean, default: false }
  });
  childSchema.index({ location: '2dsphere' });

  const Child = parentDB.model('Child', childSchema);

  // Fetch children by parentId from the child database
  const children = await Child.find({ parentId });
  const result = {};

  // Loop through each child and gather data
  for (let child of children) {
    const { name, deviceName, batteryOptimizationAllowed } = child;

    const appUsage = await App.find({ child_id: child._id });
    const formattedAppUsage = appUsage.map(app => ({
      icon: app.icon || 'default-icon.png', // Default icon
      name: app.appName || 'Unknown App',
      time: formatUsageTime(app.usageInfo ? app.usageInfo.usageMinutes : 0) // Default usage time
    }));

    const callLogs = await CallLog.find({ child_id: child._id });
    const callLogStats = {
      count: callLogs.length || 0,
      duration: formatCallDuration(callLogs.reduce((acc, log) => acc + log.duration, 0)) || '0H 0M'
    };

    const smsLogs = await Sms.find({ child_id: child._id });
    const smsLogStats = {
      incoming: smsLogs.length || 0 // Assuming this tracks total SMS logs
    };

    const contacts = await Contacts.find({ child_id: child._id });
    const contactStats = {
      total: contacts.length || 0
    };

    const photos = [];
    const videos = [];
    const mediaStats = {
      photos: { count: photos.length || 0 },
      videos: { count: videos.length || 0 }
    };

    const locations = await Location.find({ child_id: child._id });
    const locationData = locations.length > 0 ? locations.map(loc => ({
      coordinates: loc.coordinates,
      type: loc.type || 'Unknown',
      timestamp: loc.createdAt || new Date(), // Assuming `createdAt` holds the timestamp
    })) : [];

    const events = await Event.find({ child_id: child._id });
    const formattedEvents = events.map(event => ({
      title: event.title || 'Untitled Event',
      start: event.start || new Date(),
      end: event.end || new Date(),
      location: event.location || 'Unknown Location',
      description: event.description || 'No Description'
    }));

    result[name] = {
      name,
      device: deviceName || 'Unknown Device',
      battery: batteryOptimizationAllowed ? `${batteryOptimizationAllowed}%` : 'Unknown',
      appUsage: formattedAppUsage,
      callLogs: callLogStats,
      smsLogs: smsLogStats,
      photos: mediaStats.photos,
      videos: mediaStats.videos,
      contacts: contactStats,
      location: locationData, // Return all location data
      events: formattedEvents,
      // Add callRecordings and keylogger placeholders
      callRecordings: { total: 25, new: 5 }, // Placeholder call recordings data
      keylogger: [
        { content: 'Search for Flutter tips', app: 'Google', date: '07-01-2024', time: '4:00 pm' },
        { content: 'Message to mom', app: 'WhatsApp', date: '07-01-2024', time: '4:30 pm' },
      ],
    };
  }

  res.json(result);
};

// Helper functions
function formatUsageTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}H ${remainingMinutes}M`;
}

function formatCallDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}H ${minutes}M`;
}

module.exports = {
  getDeviceDataByParentId,
  testdata
};
