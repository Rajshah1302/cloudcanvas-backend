const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');

// ROUTE1: Gets all Notes: GET "api/notes/fetchNotes".
router.get('/fetchNotes', fetchUser, async (req, res) => {
    try {
        // Fetch all notes for the authenticated user
        const notes = await Note.find({ user: req.user.id });
        
        // Send the retrieved notes in the response
        res.json(notes);
    } catch (error) {
        // Handle errors, log them, and send an appropriate response
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ROUTE2: Add Notes: POST "api/notes/addNotes".
router.post('/addNotes', fetchUser, [
    body('title', 'Invalid title').isLength({ min: 1 }),
    body('description', 'Description must be at least 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // If there are validation errors, return a 400 Bad Request with the error details
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure values from the request body
        const { title, description, tag } = req.body;

        // Create a new note with the provided data
        const note = new Note({
            title,
            description,
            tag,
            user: req.user.id,
        });

        // Save the note to the database
        const savedNote = await note.save();

        // Send the saved note in the response
        res.json(savedNote);
    } catch (error) {
        // Handle errors, log them, and send an appropriate response
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
