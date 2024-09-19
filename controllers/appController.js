const App = require('../models/App');

exports.saveApps = async (req, res) => {

  try {
    const appsData = req.body.apps; // Expecting an array of apps

    if (!Array.isArray(appsData)) {
      return res.status(400).send('Invalid data format');
    }

    const newApps = [];

    for (const appData of appsData) {
      const { packageName , parent_id } = appData;

      // Check if the app with the same packageName already exists
      const existingApp = await App.findOne({ packageName , parent_id });

      if (!existingApp) {
        // If the app does not exist, prepare to insert it
        newApps.push(appData);
      } else {
        console.log(`App with packageName ${packageName} already exists. Skipping.`);
      }
    }

    // If there are new apps, insert them into the database
    if (newApps.length > 0) {
      await App.insertMany(newApps);
      console.log('New apps saved:', newApps);
      res.status(200).send('New apps saved successfully');
    } else {
      res.status(200).send('No new apps to save.');
    }
  } catch (error) {
    console.error('Error saving apps data:', error);
    res.status(500).send('Error saving apps data');
  }

};

// Fetch all calendar events from MongoDB (for example)
exports.getApps = async (req, res) => {
  try {
    const apps = await App.find();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch apps', error });
  }
};
