const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Create a User using: POST "api/auth/createuser". Doesn't require auth
router.post('/createuser', [
  // Validation 
  body('name', 'Invalid name').isLength({ min: 3 }),
  body('email', 'Invalid Email').isEmail(),
  body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If email already exists, send a response indicating the conflict
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create a new user with the provided information
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // Send the created user as a JSON response
    res.json(user);
  } catch (err) {
    // Handle errors, log them, and send an appropriate response
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
