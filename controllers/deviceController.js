const axios = require('axios');
const App = require('../models/App');
const Sms = require('../models/Sms');
const CallLog = require('../models/CallLog');
const Contacts = require('../models/Contact');
const mongoose = require('mongoose');
const Location = require('../models/Location');
const Event = require('../models/Event');

// Method for getting all vigil children data by parentId
const getDeviceDataByParentId = async (req, res) => {
  try {
    const parentId = req.params.parentId;

    // Fetch children data from external API
    const response = await axios.get(`https://vigile-parent-backend.onrender.com/api/children/childrens/${parentId}`);
    if (response.status === 200 && response.data.length > 0) {
      const childrenData = response.data; // Array of children with deviceName and other info
      const childrens = await App.distinct('child_name', { parent_id: parentId });

      if (!childrens || childrens.length === 0) {
        return res.status(404).json({ message: 'No data found for this parent_id.' });
      }

      const deviceData = {
        parentId: parentId,
        children: {},
      };

      // Loop through each child and gather data from various collections
      for (const child of childrens) {
        // Find the corresponding child in the external API data by matching child_name
        const childInfo = childrenData.find(c => c.name === child);

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

        // Format SMS logs using the 'type' column
        const smsLogsData = {
          incoming: smsLogs.filter((sms) => sms.type === 'incoming').length || 0,
          outgoing: smsLogs.filter((sms) => sms.type === 'outgoing').length || 0,
        };

        // Format contacts data
        const contactsData = {
          total: contacts.length || 0,
          new: contacts.length > 0 ? Math.min(contacts.length, 10) : 0, // Assuming a "new" field
        };

        // Placeholder for data that doesn't exist (keylogger, photos, videos)
        const keyloggerData = []; // No data available, use empty array
        const photosData = { count: 50, new: 10 }; // Placeholder data
        const videosData = { count: 15, new: 2 };  // Placeholder data
        const callRecordingsData = { total: 25, new: 5 }; // Placeholder data

        // Format location data (fetching all locations associated with the child)
        const locationData = locations.length > 0 ? locations.map(loc => ({
          latitude: loc.latitude || 'Unknown',
          longitude: loc.longitude || 'Unknown',
          date: loc.date || new Date(),
          address: loc.address || 'Unknown Address',
          child_id: loc.child_id || 'Unknown Child ID',
          child_name: loc.child_name || 'Unknown Child Name',
          parent_id: loc.parent_id || 'Unknown Parent ID',
          parent_name: loc.parent_name || 'Unknown Parent Name',
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
          device: childInfo ? childInfo.deviceName : 'Unknown Device', // Use deviceName from API response
          battery: 'Unknown', // You may need to fetch this from another source
          appUsage,            // Add app usage data here
          callLogs: callLogsData,
          smsLogs: smsLogsData, // Updated SMS logs
          photos: photosData,  // Placeholder photos data
          videos: videosData,  // Placeholder videos data
          callRecordings: {
            total: callRecordingsData.total,
            new: callRecordingsData.new,
          },
          contacts: {
            total: contactsData.total,
            new: contactsData.new,
          },
          location: locationData,   // All fields from Location model
          events: formattedEvents,
          // Add callRecordings and keylogger placeholders
          keylogger: [
            { content: 'Search for Flutter tips', app: 'Google', date: '07-01-2024', time: '4:00 pm' },
            { content: 'Message to mom', app: 'WhatsApp', date: '07-01-2024', time: '4:30 pm' },
          ],
        };
      }

      res.json(deviceData);
    } else {
      console.log('No children found or an error occurred.');
      res.status(404).json('No children found or an error occurred.');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
};
