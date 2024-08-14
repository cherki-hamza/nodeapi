// server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://hamza:W3XUhG2J0hBbzo9S@clusterhpac.8a0ma.mongodb.net/vigil?retryWrites=true&w=majority&appName=Clusterhpac', {
  /* useNewUrlParser: true,
  useUnifiedTopology: true, */
});

// start login and signup
const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', UserSchema);

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send('Invalid password');
  }

  const token = jwt.sign({ id: user._id }, 'secretkey');
  res.json({ 
    token, 
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});
// end login and signup



// start sms 
const smsSchema = new mongoose.Schema({
  address: String, // address
  name: String,  // Contact name
  body: String,  // SMS body
  date: Date,    // SMS date
});
const Sms = mongoose.model('Sms', smsSchema);

// Check if SMS already exists
app.post('/api/check-sms-exists', async (req, res) => {
  const { address, body, date } = req.body;
  try {
    const existingSms = await Sms.findOne({ address, body, date });
    if (existingSms) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error checking SMS' });
  }
});

// Save new SMS
app.post('/api/receive-sms', async (req, res) => {
  const { address, name, body, date } = req.body;
  try {
    const newSms = new Sms({ address, name, body, date });
    await newSms.save();
    res.status(200).send('SMS saved to MongoDB');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving SMS');
  }
});

// Get SMS by query parameters and return also the count of sms
app.get('/api/get_sms', async (req, res) => {
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
});
// end sms



// start apps

// Define a schema for the apps
const appSchema = new mongoose.Schema({
  appName: { type: String },
  packageName: { type: String}, // , unique: true
  icon: { type: String },
  child_id: {type: Number },
  child_name: {type: String},
  parent_id: {type: Number },
  parent_name: {type: String},
});
// Define a model for the apps
const my_app = mongoose.model('app', appSchema);

// Endpoint to save apps data
app.post('/api/save_apps', async (req, res) => {
    try {
        const appsData = req.body.apps;
        if (!Array.isArray(appsData)) {
            return res.status(400).send('Invalid data format');
        }

        // Save apps data to the database
        await my_app.insertMany(appsData);
        console.table(appsData);
        res.status(200).send('Apps data saved successfully');
    } catch (error) {
        console.error('Error saving apps data:', error);
        res.status(500).send('Error saving apps data');
    }
});

// end apps





// Define a model for the apps
//const App = mongoose.model('App', appSchema);

app.get('/api/dev', async (req, res) => {
    res.status(200).send('welcome to node js');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
