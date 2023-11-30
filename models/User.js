const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the structure of the user data
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

// Create a mongoose model for 'User' based on the defined schema
const User = mongoose.model('user', UserSchema);

// Export the User model for use in other modules
module.exports = User;
