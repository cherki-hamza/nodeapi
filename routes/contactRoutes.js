const express = require('express');
const router = express.Router();
const { storeContacts , getAllContacts } = require('../controllers/contactController');

// POST route to store a contact
router.post('/store_contacts', storeContacts);
// Get All Contacts
router.get('/get_contacts', getAllContacts);

module.exports = router;