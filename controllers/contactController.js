const Contacts = require('../models/Contact');

// Helper function to sanitize strings
function sanitizeString(input) {
    if (!input) return 'No Data';
    return input.replace(/[\uD800-\uDFFF]/g, '�');
}

// Method to store multiple contacts
exports.storeContacts = async (req, res) => {
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

        // Create a unique key for each contact
        const contactKeys = sanitizedContacts.map(contact => 
            `${contact.displayName}_${contact.child_id}_${contact.parent_id}_${contact.phones.sort().join(',')}`
        );

        // Fetch existing contacts that match any of the sanitized contacts
        const existingContacts = await Contacts.find({
            $or: sanitizedContacts.map(contact => ({
                displayName: contact.displayName,
                child_id: contact.child_id,
                parent_id: contact.parent_id,
                phones: { $all: contact.phones },
            }))
        });

        // Create a Set of keys from existing contacts for quick lookup
        const existingContactKeys = new Set(
            existingContacts.map(contact => 
                `${contact.displayName}_${contact.child_id}_${contact.parent_id}_${contact.phones.sort().join(',')}`
            )
        );

        const storedContacts = [];
        const duplicateContacts = [];

        // Filter out duplicates and save new contacts
        for (let i = 0; i < sanitizedContacts.length; i++) {
            if (existingContactKeys.has(contactKeys[i])) {
                duplicateContacts.push(sanitizedContacts[i]);
            } else {
                const newContact = new Contacts(sanitizedContacts[i]);
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
