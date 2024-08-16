const Sms = require('../models/Sms');

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
