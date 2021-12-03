const jwt = require('jsonwebtoken');


/** jwt signin required function function */

module.exports = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};