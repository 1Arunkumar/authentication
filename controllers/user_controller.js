// Import required modules
const User = require('../models/user'); // Assuming the user model is defined in '../models/user'
const bcrypt = require('bcrypt');

// Controller method for rendering habit page after checking authentication


// Controller method for rendering signup page
module.exports.up = function(req, res) {
  
    
    if(req.isAuthenticated()){
        return res.render('habit');
    }
    return res.render('signup');
};

// Controller method for creating a new user
module.exports.create = async function(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log('User already exists');
            req.flash('error','user already exists');
            return res.redirect('/users/sign-in');
        }
        if (req.body.password === req.body.C_password) {
            await User.create({
                email: req.body.email,
                password: req.body.password
            });
            req.flash('success','sign up succesfull');
            console.log('User created');
            return res.redirect('/');
        }
    } catch (err) {
        req.flash('error',err);
        console.log(err);
    }
};

// Controller method for creating a user session
module.exports.createsession = async function(req, res) {
    let user = await User.findOne({ email: req.body.email });
    res.cookie('user_id', user.id);
 
    req.flash('success','signin successfull')
    return res.render('habit', {
        title: "habit",
        
    });
    
};
module.exports.createsession1 = async function(req, res) {
    
    req.flash('success','signin successfull')
    res.render('habit', {
        title: "habit",
        
    });
    
}

// Controller method for destroying a user session (logout)
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            req.flash('error',err);
            console.error('Error during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        req.flash('success','sign out successfull');
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
                req.flash('success','password reset succesfull,signin');
                return res.redirect('/');
            }
            else{
                req.flash('error','new password doesnt match confirm password');
                return res.send('passwords doesnt match');
            }
        } else {
            req.flash('error','incorrect current password');
            return res.status(401).send('Unauthorized');
        }
    } catch (err) {
        req.flash('error',err);
        console.log(err);
    }
};

// Controller method for rendering the password reset page
module.exports.reset = function(req, res) {
    return res.render('reset');
};
