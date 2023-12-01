const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'RAJSHAH';

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
    // If there are validation errors, return a 400 Bad Request with the error details
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If email already exists, send a response indicating the conflict
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Generate salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Create a new user with the provided information
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    // Generate a JWT token for the user
    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);

    // Send the created user along with the token as a JSON response
    res.json({ token });
  } catch (err) {
    // Handle errors, log them, and send an appropriate response
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Authenticate User using: POST "api/auth/login".
router.post('/login', [
  // Validation 
  body('email', 'Invalid Email').isEmail().exists(),
  body('password', 'Invalid Password').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request with the error details
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(409).json({ error: 'Authentication failed' });
    }

    const passwordCompare = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCompare) {
      return res.status(409).json({ error: 'Authentication failed' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);

    // Send the created user along with the token as a JSON response
    res.json({ token });
  } catch (error) {
    // Handle errors, log them, and send an appropriate response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
