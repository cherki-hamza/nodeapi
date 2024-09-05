const Location = require('../models/Location');

exports.saveLocation = async (req, res) => {

  try {

    const { latitude, longitude } = req.body;
    const location = new Location({ 
      latitude,
      longitude,
      child_id: 1,
      child_name: 'child name',
      parent_id: 1,
      parent_name: 'parent name',

    });
    await location.save();
    res.status(200).send({ message: 'Location saved successfully!' });

  } catch (error) {
    console.error('Error saving apps data:', error);
    res.status(500).send('Error saving location data');
  }

};
