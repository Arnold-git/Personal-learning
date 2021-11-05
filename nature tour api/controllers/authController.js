const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const signInToken = require('../utils/signInToken');



exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passwordConfirm: req.body.passwordConfirm,
         passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signInToken(newUser._id)

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
        return next(new AppError('Please provide email and password', 400));
    }

    // CHECK IF USER EXISTS and PASSWORD CORRECT
    const user = await User.findOne({ email }).select('+password')



    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // console.log(user)

    const token = signInToken(user._id)

    res.status(200).json({
        status: 'Success',
        token
    })
})

exports.requireSignin = catchAsync(async (req, res, next) => {

    // 1) Getting token and check if valid

    let token;

    if (req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    // console.log(token)

    if(!token) {
        return next(new AppError('You are NOT logined in! Please, login to access', 401))
    }

    // 2) token verification

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
   

    // 3) check if user still exists

    freshUser = await User.findById(decoded.id);

    if(!freshUser) {
        return next(new AppError('The user belonging to this token no longer exist', 401))
    }

    // 4) Check if user changed password after token was issue

    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(AppError('User recently changed password, Please log in again', 401))
    };


    // Gran access to the protected route

    req.user = freshUser
    next()
})