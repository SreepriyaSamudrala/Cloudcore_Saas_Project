const express = require('express');         // Import Express.js to create the web server
const connectDB = require('./config/db');   // Import the function to connect to MongoDB
const User = require('./models/User');      // Import the User model (schema for user data)
const bcrypt = require('bcryptjs');         // Import bcrypt (used for password hashing/comparison)
const nodemailer = require('nodemailer');   // Import Nodemailer for sending emails
const crypto = require('crypto');           // Node.js built-in module for generating random data (for verification tokens)
require('dotenv').config();                 // Load environment variables from .env file
const cors = require('cors');               // Import CORS middleware

const app = express(); // Initialize the Express application

// --- Connect to Database ---
connectDB(); // Call the function to establish connection to MongoDB

// --- Express Middleware ---
// 1. `express.json()`: Middleware to parse incoming request bodies with JSON payloads.
//    This makes JSON data sent from the frontend available on `req.body`.
app.use(express.json());

// 2. `cors()`: Middleware to enable Cross-Origin Resource Sharing.
//    This is crucial because your frontend (e.g., running on Live Server at http://127.0.0.1:5500)
//    will be making requests to your backend (e.g., running at http://localhost:5000).
//    Browsers normally block such "cross-origin" requests for security, and CORS explicitly allows it.
//    The `origin` option MUST exactly match the URL where your frontend is being served.
app.use(cors({ origin: process.env.FRONTEND_URL }));

// --- Nodemailer Transporter Setup ---
// This configures how your server will send emails (e.g., through Gmail's SMTP server).
const transporter = nodemailer.createTransport({
    service: 'gmail', // Specifies to use Gmail's email service.
    auth: {
        user: process.env.EMAIL_USER, // Your sending email address from .env
        pass: process.env.EMAIL_PASS  // Your App Password for that email from .env
    }
});

// --- API ROUTES ---

// @route   POST /api/signup
// @desc    Handles user registration: collects data, stores in DB, sends verification email.
// @access  Public (accessible by anyone)
app.post('/api/signup', async (req, res) => {
    // Extract fullName, email, and password from the JSON body of the incoming request
    const { fullName, email, password } = req.body;

    // --- Server-Side Input Validation ---
    // It is critical to validate input on the server side, even if client-side validation exists,
    // as client-side validation can be bypassed.
    if (!fullName || !email || !password) {
        // If any required field is missing, send a 400 Bad Request response with an error message.
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    if (password.length < 8) {
        // If the password is too short, send a 400 Bad Request response.
        return res.status(400).json({ msg: 'Password must be at least 8 characters long.' });
    }

    // Basic regex validation for email format
    if (!/.+@.+\..+/.test(email)) {
        return res.status(400).json({ msg: 'Please enter a valid email address.' });
    }

    try {
        // Check if a user with the provided email already exists in the database
        let user = await User.findOne({ email });
        if (user) {
            // If a user with this email already exists, send a 400 Bad Request response.
            return res.status(400).json({ msg: 'A user with this email already exists.' });
        }

        // Generate a unique verification token for the new user.
        // crypto.randomBytes(32) generates 32 random bytes, .toString('hex') converts it to a hexadecimal string.
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create a new User instance using the data from the request.
        // The password will be automatically hashed by the `pre('save')` hook defined in `models/User.js` before saving.
        user = new User({
            fullName,
            email,
            password,
            verificationToken // Store the generated token with the user's record
        });

        await user.save(); // Save the new user document to your MongoDB database

        // --- Send Verification Email ---
        // Construct the full URL for the verification link.
        // This link will be embedded in the email and point back to your frontend's verification page,
        // passing the unique verification token as a query parameter.
        const verificationLink = `<span class="math-inline">\{process\.env\.FRONTEND\_URL\}/thank\-you\-verify\.html?token\=</span>{verificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,    // Sender's email address (from .env)
            to: user.email,                  // Recipient's email address (the newly registered user)
            subject: 'Verify Your Cloudcore Account', // Email subject line
            html: `
                <p>Hello <span class="math-inline">\{user\.fullName\},</p\>
                <p>Thank you for signing up for Cloudcore!</p>
<p>Please verify your email address by clicking on the link below:</p>
<p><a href="{verificationLink}" style="background-color: #4c51bf; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify My Account</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you did not sign up for Cloudcore, please ignore this email.</p>
<p>Best regards,<br>The Cloudcore Team</p>
` // HTML content of the email
};
// Send the email using the configured Nodemailer transporter
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification email:', error);
                    // In a production application, you might implement retry logic or alert mechanisms here.
                } else {
                    console.log('Verification email sent:', info.response); // Log successful email sending info
                }
            });

            // Send a success response back to the frontend. The frontend will then redirect the user.
            res.status(201).json({ msg: 'Sign up successful! Please check your email for verification.' });

        } catch (err) {
            console.error('Error during sign-up process:', err.message);
            // Handle specific Mongoose validation errors (e.g., if a `required` field is missing from schema)
            if (err.name === 'ValidationError') {
                return res.status(400).json({ msg: err.message });
            }
            // Handle duplicate key error (code 11000) for unique fields (like email)
            if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
                 return res.status(400).json({ msg: 'A user with this email already exists.' });
            }
            // For any other unexpected errors, send a generic 500 Internal Server Error response.
            res.status(500).send('Server Error');
        }
    });

    // @route   GET /api/verify-email
    // @desc    Handles email verification when a user clicks the link in their email.
    // @access  Public
    app.get('/api/verify-email', async (req, res) => {
        // Extract the 'token' from the URL query parameters (e.g., `?token=abcdef123...`)
        const { token } = req.query;

        if (!token) {
            // If no token is provided in the URL, send a 400 Bad Request response.
            return res.status(400).send('Verification token missing.');
        }

        try {
            // Find a user in the database whose verificationToken matches the one from the URL.
            const user = await User.findOne({ verificationToken: token });

            if (!user) {
                // If no user is found with this token, it means the token is invalid or has already been used/expired.
                return res.status(400).send('Invalid or expired verification token.');
            }

            if (user.isVerified) {
                // If the user is already marked as verified, redirect them directly to the verified page.
                return res.redirect(`${process.env.FRONTEND_URL}/thank-you-verified.html?status=already_verified`);
            }

            // If the token is valid and the user is not yet verified:
            // 1. Mark the user's `isVerified` field to true.
            user.isVerified = true;
            // 2. Clear the `verificationToken` field from the database so this token cannot be used again.
            user.verificationToken = undefined;
            await user.save(); // Save the updated user document to the database

            // Redirect the user's browser to the success page on your frontend, indicating successful verification.
            res.redirect(`${process.env.FRONTEND_URL}/thank-you-verified.html?status=success`);

        } catch (err) {
            console.error('Error during email verification:', err.message);
            // If any server-side error occurs during verification, send a generic 500 Server Error response.
            res.status(500).send('Server Error during email verification.');
        }
    });

    // --- Start the Express Server ---
    // The server will start listening for incoming HTTP requests on the specified port.
    const PORT = process.env.SERVER_PORT || 5000; // Use the port number from your .env file, or default to 5000.

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // Log a message to the console when the server successfully starts.
    ```