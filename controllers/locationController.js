const Location = require('../models/Location');

exports.saveLocation = async (req, res) => {

  try {

    const { latitude, longitude, date ,child_id , child_name , parent_id , parent_name } = req.body;
    const location = new Location({
      latitude,
      longitude,
      date,
      child_id,
      child_name,
      parent_id,
      parent_name,
    });
      await location.save();
      res.status(200).send({ message: 'Location saved successfully!' });

  } catch (error) {
      console.error('Error saving apps data:', error);
      res.status(500).send('Error saving location data');
  }

};
