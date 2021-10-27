const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.signup = catchAsync( async (req, res, next) => {

    const newUser = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passwordConfirmed: req.body.passwordConfirmed
    });
    
    const token = jwt.sign({ id: _newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIURES
    })

    res.status(200).json({
        status: 'Success', 
        data: {
            newUser
        }
    });

});  