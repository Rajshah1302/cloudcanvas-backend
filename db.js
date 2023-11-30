const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/cloudcanvas";

const connectToMongo = async () => {
    try {
        // Attempt to connect to MongoDB using the provided URI
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

// Export the connectToMongo function for use in other modules
module.exports = connectToMongo;