const CallLog = require('../models/CallLog');


// lst method call logs for save in db with check if there is exist call logs
exports.storeCallLogs = async (req, res) => {
  try {

    const logs = req.body.logs;
    let logs_count = logs.length;

    if (!logs || logs.length === 0) {
      console.error('No logs provided in the request');
      return res.status(400).send('No logs provided');
    }

    let newLogsAdded = false; // Flag to check if any new log is added
    let existingLogsCount = 0;

    for (const log of logs) {
      const { number, timestamp , child_id } = log;

      // Check if the call log already exists
      const existingLog = await CallLog.findOne({ number: number, child_id: child_id ,  timestamp: new Date(timestamp) });

      if(!existingLog) {
        console.log('Saving new log:', log);
        const newCallLog = new CallLog(log);
        await newCallLog.save();
        newLogsAdded = true; // Set flag to true if a new log is added
      } else {
        existingLogsCount++;
        console.log(`Log already exists for number: ${number} at ${timestamp}`);
      }

    }

    // Send a response based on whether new logs were added or not
    if (newLogsAdded) {
      res.status(res.statusCode).json({
        status: res.statusCode,
        message:'Call logs processed successfully',
        logs_count: logs_count
      });
    } else {
      res.status(res.statusCode).json({
        status: res.statusCode,
        message:'The Vigil Call Logs Already Updated with latest and real-time data',
      });
    }

  } catch (error) {
    console.error('Error processing call logs:', error);
    res.status(500).send('Failed to process call logs');
  }
};
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

    // Prepare an array of promises to check each log entry
    const uniqueLogs = [];

    for (const log of logs) {
      // Check if both number and timestamp match any existing log
      const existingLog = await CallLog.findOne({
        number: log.number,
        timestamp: log.timestamp
      });

      if (!existingLog) {
        uniqueLogs.push(log);
      }
    }

    // Return the logs that are unique (i.e., do not already exist in the database)
    return res.status(200).json(uniqueLogs);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to check call logs' });
  }
};


// method for get the count of callLogs
exports.calllogsCount = async function (req, res) {
  try {

    const callLogs_count = await CallLog.countDocuments();
    res.status(200).json({'callLogs_count' : callLogs_count});

  } catch (error) {
    throw new Error('Error getting total callLogs count: ' + error.message);
  }
};
