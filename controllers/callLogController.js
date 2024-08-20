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
    const logs = req.body.logs;

    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ error: 'Invalid request format. Expected an array of logs in the body.' });
    }

    const timestamps = logs.map(log => log.timestamp);
    const numbers = logs.map(log => log.number);

    // Find all logs that match any of the provided timestamps and numbers
    const existingLogs = await CallLog.find({
      timestamp: { $in: timestamps },
      number: { $in: numbers }
    });

    // Filter out logs that already exist
    const uniqueLogs = logs.filter(log => {
      return !existingLogs.some(existingLog => 
        existingLog.number === log.number && 
        existingLog.timestamp === log.timestamp
      );
    });

    // Return the unique logs
    return res.status(200).json(uniqueLogs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check call logs' });
  }
};
