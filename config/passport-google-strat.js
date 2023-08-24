// Import required modules
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user'); // Assuming the user model is defined in '../models/user'

// Define Google OAuth2 Strategy
passport.use(new googleStrategy({
    clientID: "112265320328-u4afv5toqq953pd7rr6pch0v4aq9sces.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://glorious-jade-suspenders.cyclic.cloud//users/auth/google/callback",
},
async function(accessToken, refreshToken, profile, done) {
    try {
        // Find user with the provided email
        let user = await User.findOne({ email: profile.emails[0].value }).exec();

        if (user) {
            // If user exists, return the user
            return done(null, user);
        } else {
            // If user doesn't exist, create a new user
            user = await User.create({
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex') // Generate a random password
            });
            return done(null, user);
        }
    } catch (err) {
        // Handle errors that occur during user creation or database operations
        console.log("Error in strategy", err);
        return done(err);
    }
}));

// Export passport for use in other parts of the application
module.exports = passport;
