const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
// route for authontification
app.use('/api/auth', require('./routes/authRoutes'));
// route for SMS Services
app.use('/api/sms', require('./routes/smsRoutes'));
// route for APPS Services
app.use('/api/apps', require('./routes/appRoutes'));

// Default route for testing
app.get('/api/dev', (req, res) => {
  res.status(200).send('welcome to node js');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
