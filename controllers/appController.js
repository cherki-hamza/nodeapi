const App = require('../models/App');

exports.saveApps = async (req, res) => {
  try {
    const appsData = req.body.apps; // Expecting an array of apps

    if (!Array.isArray(appsData)) {
      return res.status(400).send('Invalid data format');
    }

    const newApps = [];
    const updatedApps = [];

    for (const appData of appsData) {
      const { packageName, parent_id, usageInfo } = appData;

      // Check if the app with the same packageName and parent_id already exists
      const existingApp = await App.findOne({ packageName, parent_id });

      if (!existingApp) {
        // If the app does not exist, prepare to insert it
        newApps.push({
          appName: appData.appName,
          packageName: appData.packageName,
          icon: appData.icon, // Store the base64 icon
          child_id: appData.child_id,
          child_name: appData.child_name,
          parent_id: appData.parent_id,
          parent_name: appData.parent_name,
          usageInfo: appData.usageInfo || {}, // Store usage info if available
        });
      } else {
        // If the app exists, update the usageInfo
        existingApp.usageInfo = {
          usageMinutes: usageInfo?.usageMinutes || existingApp.usageInfo.usageMinutes,
          lastTimeUsed: usageInfo?.lastTimeUsed || existingApp.usageInfo.lastTimeUsed,
        };

        // Optional: Update other fields like icon if they are provided
        if (appData.icon) {
          existingApp.icon = appData.icon; // Update the icon if a new one is provided
        }

        // Save the updated app data
        await existingApp.save();
        updatedApps.push(existingApp);
        console.log(`App with packageName ${packageName} updated.`);
      }
    }

    // Insert new apps if there are any
    if (newApps.length > 0) {
      await App.insertMany(newApps);
      console.log('New apps saved:', newApps);
    }

    res.status(200).json({
      message: 'Apps processed successfully',
      newApps: newApps.length,
      updatedApps: updatedApps.length,
    });
    
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


// method for get the count of apps
exports.appsCount = async function (req, res) {
  try {

    const apps_count = await App.countDocuments();
    res.status(200).json({'apps_count' : apps_count});

  } catch (error) {
    throw new Error('Error getting total apps count: ' + error.message);
  }
  
};
