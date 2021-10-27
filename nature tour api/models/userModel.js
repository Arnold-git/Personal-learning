const mongoose = require('mongoose');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
        trim: true,
        maxlength: [100, 'Name must not exceed 100 character'],
        
    },
    email: {
        type: String,
        unique: [true, 'This email is already in use'],
        required: [true, 'Email is a required field'],
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
        required: [true, 'Please, provide a valid password'],
        minlength: [8, 'Password must be atleast 8 character']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please, confirm your password'],
        validate: {
            // This is only wortk for SAVE and .create
            // validator is a callback function
            validator: function (el) {
                return el === this.password
            }, 
            message: 'password and password confirm must be the same'
        }
    }
});


// DOCUMENT MIDDLEWARE TO ENCRYPT PASSWORD

userSchema.pre('save', function(next) {
    if(!this.isModified('password')) return next();

    
})

const User = mongoose.model('User', userSchema)

module.exports = User

