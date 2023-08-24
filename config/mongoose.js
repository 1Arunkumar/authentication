// Import the mongoose library
const mongoose = require('mongoose');

// Define the URL for the MongoDB connection
const URL = 'mongodb://127.0.0.1:27017/habbit_db';

// Connect to the MongoDB using the defined URL
mongoose.connect(URL)
  .then(() => console.log('MongoDb Is Up And Connected'))
  .catch((error) => console.log('Error connecting to the database', error));

// Get the MongoDB connection instance
const db = mongoose.connection;

// Export the MongoDB connection instance for use in other parts of the application
module.exports = db;
