const Location = require('../models/Location');

exports.saveLocation = async (req, res) => {

  try {

    const { latitude, longitude, date, address ,child_id , child_name , parent_id , parent_name } = req.body;
    const location = new Location({
      latitude,
      longitude,
      date,
      address,
      child_id,
      child_name,
      parent_id,
      parent_name,
    });
      await location.save();
      res.status(200).send({ message: 'Location saved successfully!' });

  } catch (error) {
      console.error('Error saving location:', error);
      res.status(500).send('Error saving location data');
  }

};


// Fetch all calendar events from MongoDB (for example)
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch locations', error });
  }
};


// method to get the total count of Locations
exports.locationsCount = async function (req, res) {
  try {

    const locations_count = await Location.countDocuments();
    res.status(200).json({'locations_count' : locations_count});

  } catch (error) {
    throw new Error('Error getting total Locations count: ' + error.message);
  }
};

