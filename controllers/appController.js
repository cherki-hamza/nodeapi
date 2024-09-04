const App = require('../models/App');

exports.saveApps = async (req, res) => {
   
  try {
    const appsData = req.body.apps;  // Expecting array of apps in the request
    if (!Array.isArray(appsData)) {
      return res.status(400).send('Invalid data format. Expected an array of apps.');
    }

    const uniqueApps = [];
    const appsToInsert = [];

    for (let app of appsData) {
      const { name, packageName } = app;

      // Check if app already exists in the database by packageName
      const existingApp = await App.findOne({ packageName });

      if (!existingApp) {
        let iconUrl = '';

        // Upload the icon to cloud storage (e.g., Cloudinary)
        if (app.icon) {
          const result = await cloudinary.uploader.upload(app.icon.tempFilePath, {
            folder: 'app-icons',
            public_id: `${name}_icon`,
          });
          iconUrl = result.secure_url;
        }

        // If app is new (not found in the database), prepare to insert
        const newApp = {
          appName: name,
          packageName: packageName,
          icon: iconUrl,
          child_id: app.child_id || null,
          child_name: app.child_name || '',
          parent_id: app.parent_id || null,
          parent_name: app.parent_name || '',
        };

        appsToInsert.push(newApp);
      } else {
        // If app is already in the database, skip it
        console.log(`App with packageName ${packageName} already exists, skipping.`);
      }
    }

    if (appsToInsert.length > 0) {
      // Insert new apps into the MongoDB database
      await App.insertMany(appsToInsert);
      console.log('New apps inserted:', appsToInsert);
      res.status(200).send('Apps uploaded and saved successfully.');
    } else {
      res.status(200).send('No new apps to insert.');
    }
  } catch (error) {
    console.error('Error uploading apps:', error);
    res.status(500).send('Error uploading apps.');
  }
  
};
