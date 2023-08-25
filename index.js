const express = require('express');
const app = express();
const port = 8000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportGoogle = require('./config/passport-google-strat'); // Assuming this sets up Google OAuth strategy
const passportLocal = require('./config/passport-local-strat'); // Assuming this sets up local strategy
const flash= require('connect-flash');
const db = require('./config/mongoose'); // Make sure this is properly defined
const customMware = require('./config/middleware');
// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('./assets'));
app.set('view engine', 'ejs');
app.set('views', './views');

// Session configuration
app.use(session({
    name: 'habbit', // Name of the session cookie
    secret: 'something', // Secret used to sign the session ID cookie
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100 // Adjust the time as needed (e.g., 100 minutes)
    }
}));

// Initialize Passport and use passport session
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set authenticated user in response locals
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

// Route handling
app.use('/', require('./routes')); // Assuming routes are defined in './routes'

// Start the server
app.listen(port, function (err) {
    if (err) {
        console.log('Error:', err);
    }
    console.log('Server is running on port', port);
});
