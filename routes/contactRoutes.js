const express = require('express');
const router = express.Router();
const { storeContacts } = require('../controllers/contactController');

// POST route to store a contact
router.post('/store_contacts', storeContacts);

module.exports = router;