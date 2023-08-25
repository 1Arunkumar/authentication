// Import required modules
const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user'); // Assuming the user model is defined in '../models/user'

// Configure local strategy for authentication
passport.use(new localStrategy({
    usernameField: 'email', // Use 'email' field as the username
    passReqToCallback: true // Pass the request object to the callback function
},
async function(req, email, password, done) {
    try {
        // Find user by email
        let user = await User.findOne({ email: email });

        if (user) {
            // Compare provided password with stored hashed password
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

            if (isPasswordMatch) {
                console.log('Signin success');
                req.flash('success','signin successfull');
                return done(null, user); // Authentication successful
            } else {
                req.flash('error','Invalid password')
                console.log('Invalid password');
                return done(null, false); // Authentication failed
            }
        } else {
            req.flash('error','user doesnt exist');
            console.log('User does not exist');
            return done(null, false); // Authentication failed
        }
    } catch (error) {
        req.flash('error',err);
        console.log('Error in finding user --> passport');
        return done(error);
    }
}));

// Serialize user object to store in session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize user object from session
passport.deserializeUser(async function(id, done) {
    try {
        let user = await User.findById(id);
        return done(null, user);
    } catch (error) {
        console.log('Error in finding user --> passport');
        return done(error);
    }
});

// Middleware to check if a user is authenticated
passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    return res.redirect('/'); // Redirect to the homepage if not authenticated
};

// Set the authenticated user in res.locals for easy access in views
passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user; // Make the user object available in views
    }
    next();
};

// Export the configured passport instance
module.exports = passport;
