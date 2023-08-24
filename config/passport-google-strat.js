// Import required modules
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user'); // Assuming the user model is defined in '../models/user'

// Define Google OAuth2 Strategy
passport.use(new googleStrategy({
    clientID: "550098731809-de3r0s8t1areh4hk8remhudc05o68vsn.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
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
