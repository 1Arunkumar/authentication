// Import required modules
const User = require('../models/user'); // Assuming the user model is defined in '../models/user'
const bcrypt = require('bcrypt');

// Controller method for rendering habit page after checking authentication
module.exports.in = async function(req, res) {
    if (req.isAuthenticated()) {
        let user = await User.findOne({ email: req.body.email });
        res.cookie('user_id', user.id); // Set user_id cookie
        return res.render('habit', {
            title: "habit"
        });
    }
    return res.render('signin'); // Render signin page if not authenticated
};

// Controller method for rendering signup page
module.exports.up = function(req, res) {
    return res.render('signup');
};

// Controller method for creating a new user
module.exports.create = async function(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log('User already exists');
            return res.redirect('/users/sign-in');
        }
        if (req.body.password === req.body.C_password) {
            await User.create({
                email: req.body.email,
                password: req.body.password
            });
            console.log('User created');
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
};

// Controller method for creating a user session
module.exports.createsession = function(req, res) {
    return res.render('habit', {
        title: "habit"
    });
};

// Controller method for destroying a user session (logout)
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.cookie('user_id', null); // Clear user_id cookie
        return res.redirect('/');
    });
};

// Controller method for updating user password
module.exports.update = async function(req, res) {
    try {
        let user = await User.findById(req.cookies.user_id);
        const isPasswordMatch = await bcrypt.compare(req.body.curr_password, user.password);
        if (isPasswordMatch) {
            if (req.body.new_password === req.body.C_password) {
                // Hash the new password using bcrypt
                const saltRounds = 10;
                const newPassword = req.body.new_password;
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                user.password = hashedPassword; // Update user's password
                await user.save();
                return res.redirect('/');
            }
            else{
                return res.send('passwords doesnt match');
            }
        } else {
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.log(err);
    }
};

// Controller method for rendering the password reset page
module.exports.reset = function(req, res) {
    return res.render('reset');
};
