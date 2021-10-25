const mongoose = require('mongoose');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name is required'],
        trim: true,
        maxlength: [40, 'Name must not exceed 40 character'],
        minlength: [10, 'Name must not be less than 10'],
    },
    email: {
        type: String,
        require: [true, 'Email is a required field'],
        validate: {
            validator: validator.isEmail(),
            message: 'Provide a valid email'
        }
    },
    photo: {
        type: String,
        require: [true, 'Provide a valid photo']
    },
    password: {
        type: String
    }



})

const User = mongoose.model('User', userSchema)

module.exports = User

