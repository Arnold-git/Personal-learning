const mongoose = require('mongoose');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name'],
        trim: true,
        maxlength: [100, 'Name must not exceed 100 character'],
        minlength: [10, 'Name must not be less than 10'],
    },
    email: {
        type: String,
        unique: [true, 'This email is already in use'],
        require: [true, 'Email is a required field'],
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Provide a valid email'
        }
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        require: [true, 'Provide a valid password'],
        minlength: [8, 'Password must be atleast 8 character']
    },
    passwordConfirm: {
        type: String,
        require: [true, 'Confirm your password']
    }



})

const User = mongoose.model('User', userSchema)

module.exports = User

