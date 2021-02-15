const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//NOTE  entrance=> 'http://localhost:3000/api/auth'

router.post("/signup", (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return res.status(401).json({
            message: 'There is no email or password'
        });
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            const newUser = new User({
                email: req.body.email,
                password: hash
            });
            newUser.save()
                .then(savedUser => {
                    const token = jwt.sign(
                        {email: savedUser.email, userId: savedUser._id },
                        'secrete-must-be-long',
                        {expiresIn: "1h"}
                    );
                    return res.status(201).json({
                        message: 'client Successfully signup',
                        userId: savedUser._id ,
                        token: token,
                        expiresIn: 180000 //1hr in millisecond
                    }); 
                })
                .catch(err => {
                    return res.status(401).json({
                        message: 'Failed to signup; Your email already is taken',
                        error: err.message
                    }); 
                })
        });
    });
});

router.post("/login", (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return res.status(401).json({
            message: 'There is no email or password'
        });
    }
    let fetchedUser;
    User.findOne({email: req.body.email})
    .then(userData => {
        fetchedUser = userData;
        console.log('User from Database: ', userData);
        if(!userData) {
            return res.status(401).json({
                message: 'There is no userData with this email'
            });
        }
        bcrypt.compare(req.body.password, userData.password)
        .then(isUser => {
            if(isUser) {
                const token = jwt.sign(
                    {email: fetchedUser.email, userId: fetchedUser._id },
                    'secrete-must-be-long',
                    {expiresIn: "1h"}
                );
                return res.status(201).json({
                    message: 'You are Successfully Authenticated!',
                    userId: userData._id,
                    token: token,
                    expiresIn: 180000 //1hr in millisecond
                });
            }else{
                return res.status(401).json({
                    message: 'You are Failed in Authention!'
                });
            }
        })
        .catch(err => {
            console.log("1 : ", err);
        })
    })
    .catch(err => {
        console.log("2 : ", err);
    })
});

module.exports = router;