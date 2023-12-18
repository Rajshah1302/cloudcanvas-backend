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
// ROUTE3: Update Notes: PUT "api/notes/updateNote/:id". Login Required
router.put('api/notes/updateNote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Create a new note object with updated fields
        const updatedNote = {};
        if (title) { updatedNote.title = title; }
        if (description) { updatedNote.description = description; }
        if (tag) { updatedNote.tag = tag; }

        // Find the note to be updated
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note not found");
        }

        // Check if the authenticated user is the owner of the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Restricted");
        }

        // Update the note and retrieve the updated note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: updatedNote }, { new: true });

        // Send the updated note in the response
        res.json({ note });
    } catch (error) {
        // Handle errors, log them, and send an appropriate response
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ROUTE4: Delete Notes: DELETE "api/notes/deleteNote/:id". Login Required
router.delete('/deleteNote/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be delete
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Note not found");
        }

        // Check if the authenticated user is the owner of the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Restricted");
        }

        // Delete the note and retrieve the updated note
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            // If the note was not deleted for some reason
            return res.status(500).json({ error: "Failed to delete the note" });
        }

        // Send success message in the response
        res.json({ success: "Note deleted successfully" });
    } catch (error) {
        // Handle errors, log them, and send an appropriate response
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;
