const express = require('express');
const router = express.Router();
const { storeContacts , getAllContacts , contactsCount } = require('../controllers/contactController');

// POST route to store a contact
router.post('/store_contacts', storeContacts);
// Get All Contacts
router.get('/get_contacts', getAllContacts);

// route for get the count of contacts
router.get('/contacts_count', contactsCount);

module.exports = router;