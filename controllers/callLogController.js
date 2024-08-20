const CallLog = require('../models/CallLog');


// method for add new call logs
exports.addCallLogs = async (req, res) => {
  try {
    const callLogs = req.body.callLogs; // Expects an array of call logs
    if (!Array.isArray(callLogs)) {
      return res.status(400).json({ error: 'Expected an array of call logs' });
    }

    const insertedLogs = await CallLog.insertMany(callLogs);
    res.status(201).json(insertedLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to store call logs' });
  }
};

// method for get all call logs
exports.getCallLogs = async (req, res) => {
  try {
    const callLogs = await CallLog.find();
    res.status(200).json(callLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call logs' });
  }
};

// method for check the existing call logs
exports.checkCallLog = async (req, res) => {
  try {
    const { name, number, timestamp } = req.query;

    if (!name || !number || !timestamp) {
      return res.status(400).json({ error: 'Missing required query parameters: name, number, timestamp' });
    }

    const existingLog = await CallLog.findOne({ name, number, timestamp });

    if (existingLog) {
      return res.status(200).json({ exists: true, log: existingLog });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check call log' });
  }
};
