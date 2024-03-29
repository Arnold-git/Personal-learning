const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/appError');
const signInToken = require('../utils/signInToken');
const sendEmail = require('../utils/email');
const createSendToken = require('../utils/createSendToken');

exports.signup = catchAsync(async (req, res, next) => {
  //    const { name, email, password, passwordConfirma, passwordChangedAt, role} = req.body;
  // pass user details as request body
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  createSendToken(newUser, 201, res);

  const user = await newUser.save();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  /** CHECK IF CLIENT SENDS EMAIL AND PASSWORD */
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  /** CHECK IF USER EXISTS and PASSWORD CORRECT */
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // console.log(user)

  createSendToken(user, 200, res);
});

exports.requireSignin = catchAsync(async (req, res, next) => {
  /** Getting token and check if valid */

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log(token)

  if (!token) {
    return next(
      new AppError('You are NOT logined in! Please, login to access', 401)
    );
  }

  /** 2) token verification */

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  /** 3) check if user still exists */

  currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist', 401)
    );
  }

  /** 4) Check if user changed password after token was issue */

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password, Please log in again', 401)
    );
  }

  /** Grant access to the protected route */
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  /** 1) GET USER BASED ON EMAIL */
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  /** 2) GENERATE RANDOM RESET TOKEN */

  const resetToken = user.changedPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  /** 3) SEND IT TO USER EMAIL */

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password Submit a PATCH request with your new Password and passwordConfirm to: ${resetURL}.\nif you didn't forget your password, ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email, try again latter'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //** 1) Get user based on the tokeb */

  const hanshedToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hanshedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //** 2) if token has not expired, and there is user, set the new password */

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //** 3) Update changedPasswordAt property of the user */
  //** 4) Log the user in, send JWT */

  const token = signInToken(user._id);

  createSendToken(user, 200, res);
});

// exports.updatePassword = catchAsync(async (req, res, next) => {
//     /** 1) Get user from collection */
//     const user = await User.findById(req.user.id).select('+password');
//     /** 2) Check if posted current password is correct */
//     if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//         return next(new AppError('Your current password is wrong.', 401));
//     }
//     /** 3) if yes, update password */
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;

//     await user.save();
//     /** 4) log user in, send JWT token */
//     createSendToken(user, 200, res)
// });

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection

  const { passwordCurrent, password, passwordConfirm } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  console.log(user.name);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
