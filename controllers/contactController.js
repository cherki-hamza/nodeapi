const Contacts = require('../models/Contact');

// Helper function to sanitize strings
function sanitizeString(input) {
    if (!input) return 'No Data';
    return input.replace(/[\uD800-\uDFFF]/g, '�');
}

// Method to store multiple contacts
exports.storeContacts = async(req, res) => {
  
  try {
    const contacts = req.body;
    
    // Check if req.body is an array
    if (!Array.isArray(contacts)) {
        return res.status(400).json({ error: 'Invalid data format: expected an array of contacts' });
    }

    const sanitizedContacts = contacts.map(contact => {
        return {
            displayName: sanitizeString(contact.displayName),
            phones: contact.phones.map(phone => sanitizeString(phone)),
            child_id: contact.child_id,
            child_name: sanitizeString(contact.child_name),
            parent_id: contact.parent_id,
            parent_name: sanitizeString(contact.parent_name),
        };
    });

    const storedContacts = [];
    const duplicateContacts = [];

    for (const contact of sanitizedContacts) {
        const existingContact = await Contacts.findOne({
            displayName: contact.displayName,
            phones: { $all: contact.phones }, // Ensuring all phone numbers match
        });

        if (existingContact) {
            duplicateContacts.push(contact);
        } else {
            const newContact = new Contacts(contact);
            await newContact.save();
            storedContacts.push(newContact);
        }
    }

    if (storedContacts.length === 0) {
        return res.status(200).json({ message: 'All contacts are already up-to-date.' });
    } else {
        return res.status(201).json({
            message: 'Contacts processed successfully.',
            storedContacts,
            duplicateContacts,
        });
    }
  } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
  }

}

