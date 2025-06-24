// cloudcore-backend/config/db.js
const mongoose = require('mongoose'); 
require('dotenv').config();           

// Function to connect to MongoDB
const connectDB = async () => {
    try {
       
        await mongoose.connect(process.env.MONGODB_URI, {
            // These options are for older Mongoose versions and are deprecated in 6+.
            // You can generally omit them if you have a recent Mongoose (v6 or v7).
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true, // Not supported in Mongoose 6+
            // useFindAndModify: false // Not supported in Mongoose 6+
        });
        console.log('MongoDB Connected...'); 
    } catch (err) {
        console.error('MongoDB connection error:', err.message); 
        process.exit(1);
    }
};

module.exports = connectDB; // Export this function so it can be used in server.js