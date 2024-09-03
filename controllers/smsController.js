const Sms = require('../models/Sms');

// method for store sms without duplicate 
exports.storeSms = async (req,res) => {
   
  try {
    const smsList = req.body.sms; // Assume req.body is an array of SMS objects

    let savedSmsCount = 0;
    let duplicateSmsCount = 0;

    // Loop through each SMS message in the list
    for (let sms of smsList) {
      const { address, body, date } = sms;

      // Check if the SMS already exists in the database
      const existingSms = await Sms.findOne({ address, body, date });

      if (existingSms) {
        duplicateSmsCount++;
        continue; // Skip storing this SMS if it's a duplicate
      }

      // Create a new SMS document
      const newSms = new Sms({
        address,
        body,
        date,
      });

      // Save the SMS document to the database
      await newSms.save();
      savedSmsCount++;
    }

    res.status(201).json({
      message: `Processed ${smsList.length} SMS messages. Stored ${savedSmsCount} new messages, skipped ${duplicateSmsCount} duplicates.`,
    });
  } catch (error) {
    console.error('Error storing SMS:', error);
    res.status(500).json({ message: 'Server error', error });
  }

};

exports.checkSmsExists = async (req, res) => {
  const { address, body, date } = req.body;

  try {
    const existingSms = await Sms.findOne({ address, body, date });
    res.status(200).json({ exists: !!existingSms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error checking SMS' });
  }
};

exports.receiveSms = async (req, res) => {
  const { address, name, body, date } = req.body;

  try {
    const newSms = new Sms({ address, name, body, date });
    await newSms.save();
    res.status(200).send('SMS saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving SMS');
  }
};

exports.getSms = async (req, res) => {
  const { address, name, date } = req.query;
  const query = {};

  if (address) query.address = address;
  if (name) query.name = name;
  if (date) query.date = new Date(date);

  try {
    const smsList = await Sms.find(query);
    const smsCount = await Sms.countDocuments(query);

    res.status(200).json({
      count: smsCount,
      messages: smsList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching SMS' });
  }
};
