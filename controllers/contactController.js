const Contacts = require('../models/Contact');

// Helper function to sanitize strings
function sanitizeString(input) {
    if (!input) return 'No Data';
    return input.replace(/[\uD800-\uDFFF]/g, '�');
}

// Method to store multiple contacts
exports.storeContacts = async(req, res) => {
    try {
        const contacts = req.body; // Assuming req.body is an array of contacts

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

        res.status(201).json({
            message: 'Contacts processed successfully.',
            storedContacts,
            duplicateContacts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

