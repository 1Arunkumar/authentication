const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 8, (err, hash) => {
            if (err) {
                return next(err);
            }
            this.password = hash; // Store the hashed password
            next();
        });
    }
});

// Create the User model using the defined schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
