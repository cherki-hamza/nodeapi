const App = require('../models/App');

exports.saveApps = async (req, res) => {
  try {
    const appsData = req.body.apps;
    if (!Array.isArray(appsData)) {
      return res.status(400).send('Invalid data format');
    }

    await App.insertMany(appsData);
    console.table(appsData);
    res.status(200).send('Apps data saved successfully');
  } catch (error) {
    console.error('Error saving apps data:', error);
    res.status(500).send('Error saving apps data');
  }
};
