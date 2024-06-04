require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI_LOCAL;

const connectDB = async () => {
try {
    await mongoose.connect(mongoURI, {
      // These options are no longer necessary in Mongoose 6.x and later
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

const closeDB = async () => {
    try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
    }
};

module.exports = {
    connectDB,
    closeDB,
};