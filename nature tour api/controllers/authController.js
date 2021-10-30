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


exports.login = catchAsync(async (req, res, next) => {
    const {email, password } = req.body

    // CHECK IF CLIENT SENDS EMAIL AND PASSWORD
    if (!email || !password) {
        return next(new AppError('Please provide email and password'), 400);
    }

    // CHECK IF USER EXISTS and PASSWORD CORRECT
    const user = await User.findOne({ email }).select('+password')

    const checkPassword = user.correctPassword(password, user.password)

    if (!user || checkPassword) {
        return next(new AppError('Incorrect email or password'), 401)
    }

    console.log(user)

    const token = '';

    res.status(200).json({
        status: 'Success',
        token
    })
})