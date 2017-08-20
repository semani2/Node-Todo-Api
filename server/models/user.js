const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        // Array of tokens
        // Schema for one token object
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Overriding method
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    // Usung a regular function insted of arrow so that we can bind
    // the this keyword which is the document

    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(), 
        access
    }, 'abc123').toString();

    // Pushing to user -> tokens
    user.tokens.push({
        access,
        token
    });

    //Saving to database, and returning a promise.
    return user.save().then(() => {
        return token;
    });
};

// User Mongoose model
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
}