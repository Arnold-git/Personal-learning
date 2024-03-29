const signInToken = require("./signInToken")


module.exports = (user, statusCode, res) => {
    const token = signInToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
}