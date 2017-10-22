const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/database');

// User Schema --

const UserSchema = mongoose.Schema({
        name: {
            type: String,
            unique: true
        },
        email: {
            type: String,
            required: true
        },
        type: {
          type: String
        },
        password: {
            type: String,
            required: true
        }}, {
        versionKey: false
    }
);

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.getUserByEmail = (email, callback ) => {
    console.log(email);
    const query = {email: email};
    User.findOne(query, callback)
};

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err,hash) => {
            //if(err) throw err;
            newUser.password = hash;
            //console.log(newUser.save(callback));
            newUser.save(callback);
        });
    })
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;

        callback(null, isMatch);
    });
};
