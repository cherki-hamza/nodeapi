const App = require('../models/App');
const Sms = require('../models/Sms');
const CallLog = require('../models/CallLog');
const Contacts = require('../models/Contact');

const getDeviceDataByParentId = async (req, res) => {
  try {
    const parentId = req.params.parentId; // Get the parent_id from the URL

    // Fetch distinct child names associated with the parent_id
    const children = await App.distinct('child_name', { parent_id: parentId });

    if (!children || children.length === 0) {
      return res.status(404).json({ message: 'No data found for this parent_id.' });
    }

    const deviceData = {};

    // Loop through each child and gather data from various collections
    for (const child of children) {
      const [apps, callLogs, smsLogs, contacts] = await Promise.all([
        App.find({ child_name: child, parent_id: parentId }),
        CallLog.find({ child_name: child, parent_id: parentId }),
        Sms.find({ child_name: child, parent_id: parentId }),
        Contacts.find({ child_name: child, parent_id: parentId }),
      ]);

      // Format app usage data
      const appUsage = apps.map((app) => ({
        icon: app.icon, // Assuming icon is already stored in base64 format
        name: app.appName,
        time: `${Math.floor(app.usageInfo.usageMinutes / 60)}H ${app.usageInfo.usageMinutes % 60}M`,
      }));

      // Format call logs
      const totalCallDuration = callLogs.reduce((acc, log) => acc + log.duration, 0);
      const callLogsData = {
        count: callLogs.length,
        duration: `${Math.floor(totalCallDuration / 60)}H ${totalCallDuration % 60}M`,
      };

      // Format SMS logs
      const smsLogsData = {
        incoming: smsLogs.filter((sms) => sms.body.startsWith('Incoming')).length, // Replace with correct filtering logic
        outgoing: smsLogs.filter((sms) => sms.body.startsWith('Outgoing')).length, // Replace with correct filtering logic
      };

      // Format contacts data
      const contactsData = {
        total: contacts.length,
        new: contacts.length, // Assuming no distinction between total/new, you can modify this if needed
      };

      // Populate the device data for each child
      deviceData[child] = {
        name: child,
        device: apps[0]?.packageName || 'Unknown Device',
        battery: 'Unknown', // You may need to fetch this from another source
        appUsage,
        callLogs: callLogsData,
        smsLogs: smsLogsData,
        photos: { count: 50, new: 10 }, // Placeholder, modify with real data
        videos: { count: 15, new: 2 },  // Placeholder, modify with real data
        callRecordings: { total: 25, new: 5 }, // Placeholder, modify with real data
        contacts: contactsData,
        keylogger: [], // Assuming no keylogger data in your models, you can add if necessary
      };
    }

    res.json(deviceData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeviceDataByParentId,
};
