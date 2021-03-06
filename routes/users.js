const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


const User = require('../models/users');


//register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.regname,
        email: req.body.regemail.toLowerCase(),
        password: req.body.regpassword,
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
    let email = req.body.email;
    email = email.toLowerCase();
    const password = req.body.password;

    console.log("req body", req.body);

    User.getUserByEmail(email, (err, user) => {
        if (err) {
           console.log(err);
         }
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
                const token = jwt.sign(payload, process.env.secret||config.secret, {
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
