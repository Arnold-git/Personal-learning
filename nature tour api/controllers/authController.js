const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel')


exports.signup = catchAsync( async (req, res, next) => {

    const newUser = await User.create(req.body);

    res.status(200).json({
        status: 'Success', 
        data: {
            newUser
        }
    });

});