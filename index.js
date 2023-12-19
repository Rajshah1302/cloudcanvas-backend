const connectToMongo = require("./db");
const express = require('express');

// Creating an instance of Express
const app = express();
const port = 2000;
connectToMongo();

// Using JSON middleware for parsing requests
app.use(express.json());

// Setting up the root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Setting up routes for authentication and notes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`CloudCanvas Backend listening on port ${port}`);
});
