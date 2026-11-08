const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log('Database successfully connected');
    } catch (error) {
        console.log('Database connection error', error);
        throw error;
    }
}

module.exports = connectDB;