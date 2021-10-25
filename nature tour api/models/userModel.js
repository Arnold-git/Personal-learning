const mongoose = require('mongoose');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name is required'],
        trim: true,
        maxlength: [40, 'Name must not exceed 40 character'],
        minlength: [10, 'Name must not be less than 10'],
    }



})

const User = mongoose.model('User', userSchema)

module.exports = User

