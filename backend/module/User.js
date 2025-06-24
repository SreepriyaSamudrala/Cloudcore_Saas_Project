// cloudcore-backend/models/User.js
const mongoose = require('mongoose'); // Import Mongoose
const bcrypt = require('bcryptjs');   // Import bcrypt for password hashing

// Define the User Schema (the structure of a user document in MongoDB)
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'], // This field is mandatory
        trim: true // Automatically remove leading/trailing whitespace
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensures that no two users can have the same email address
        match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic server-side regex validation for email format
        lowercase: true, // Store emails in lowercase to prevent issues with case-sensitive queries
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'], // Server-side minimum length validation
    },
    isVerified: {
        type: Boolean,
        default: false // New field: set to true after email verification, default is false
    },
    verificationToken: {
        type: String,
        unique: true, // Ensures each verification token is unique
        sparse: true // Allows null values, but enforces uniqueness for non-null values (token will be removed after use)
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically sets the creation date and time
    }
});

// Mongoose Pre-Save Hook for Password Hashing
// This function will run *before* a User document is saved to the database.
UserSchema.pre('save', async function(next) {
    // Check if the 'password' field has been modified (is new or updated).
    // We only hash if it's been modified to avoid re-hashing an already hashed password during other updates.
    if (!this.isModified('password')) {
        return next(); // If not modified, proceed to the next middleware/save operation
    }

    // Generate a 'salt' (a random string)
    // The salt is combined with the password before hashing, making it much harder to crack identical passwords.
    const salt = await bcrypt.genSalt(10); // 10 rounds of hashing (a good balance of security and speed)

    // Hash the user's plain-text password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed with saving the user document with the hashed password
});

// Export the Mongoose model. 'User' will correspond to a 'users' collection in MongoDB.
module.exports = mongoose.model('User', UserSchema);