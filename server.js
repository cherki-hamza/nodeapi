// server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://hamza:W3XUhG2J0hBbzo9S@clusterhpac.8a0ma.mongodb.net/vigil?retryWrites=true&w=majority&appName=Clusterhpac', {
  /* useNewUrlParser: true,
  useUnifiedTopology: true, */
});

const smsSchema = new mongoose.Schema({
  address: String,
  body: String,
  date: Date,
});

const Sms = mongoose.model('Sms', smsSchema);

app.post('/receive-sms', async (req, res) => {
  const { address, body, date } = req.body;
  try {
    const newSms = new Sms({ address, body, date });
    await newSms.save();
    res.status(200).send('SMS saved');
  } catch (error) {
    res.status(500).send('Error saving SMS');
  }
});

app.get('/dev', async (req, res) => {
    res.status(200).send('welcome to node js');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
