const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');



exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })

    const user = await newUser.save()

    res.status(200).json({
        status: 'Success',
        token, 
        data: {
            user: user
        }
    });

});  


exports.login = (req, res, next) => {
    const {email, password } = req.body

    if (!email || !password) {
        next(new AppError('Please provide email and password'), 400)
    }

    const token = '';

    res.status(200).json({
        status: 'success',
        token
    })
}