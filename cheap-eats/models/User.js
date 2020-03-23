const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');
const validator = require('validator/es/lib/isEmail');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid email!'],
        requird: 'You need an email to continue...'
    },
    name: {
        type: String,
        required: 'Enter your name',
        trim: true
    },
    password
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

// handle errors for unique emails better
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);