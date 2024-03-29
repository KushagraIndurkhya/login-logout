const mongoose = require('mongoose');
var crypto = require('crypto');
// Set up the model
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});

// Set Username and Password
UserSchema.methods.setInfo = function(username, email) {
    this.name = username;
    this.email = email;
};

// Set Password
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

//Check Password
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

//Export
const User = module.exports = mongoose.model('User', UserSchema);