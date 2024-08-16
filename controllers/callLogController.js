const CallLog = require('../models/CallLog');

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

exports.getCallLogs = async (req, res) => {
  try {
    const callLogs = await CallLog.find();
    res.status(200).json(callLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve call logs' });
  }
};
