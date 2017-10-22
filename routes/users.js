const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


const User = require('../models/users');


//register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: "user"
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            console.log(err);
            res.json({success:false, msg:'failed to register user'});
        } else {
            res.json({success:true, msg:'success to register user'});
        }
    });
});

//authentice
router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(req.body);

    User.getUserByEmail(email, (err, user) => {
        console.log(user);
        if (err) throw err;

        if (!user) {
            return res.json({success:false, msg: 'user not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if(isMatch) {
              console.log("user", user);



              let payload = {
                  name: user.name,
                  email: user.email,
                  password: user.password,
                  type: user.type
              }
                const token = jwt.sign(payload, config.secret, {
                    expiresIn: "7d" // 1week
                });

                res.json({
                    success: true,
                    token:  token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        type: user.type
                    }
                })
            } else { //no match
                return res.json({success: false, msg:'Wrong Password'});
            }
        });
    })
});

module.exports = router;
