const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')


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

    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin']\
        default: 'user'

    },
    password: {
        type: String,
        required: [true, 'Please, provide a valid password'],
        minlength: [8, 'Password must be atleast 8 character'],
        select: false
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
    },
    passwordChangedAt: Date
});


// DOCUMENT MIDDLEWARE TO ENCRYPT PASSWORD
userSchema.pre('save', async function(next) {

    // ONLY RUN FUNCTION IF PASSWORD IS ACTUALLY MODIFIED
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    
    next()
})

// MONGOOSE INSTANCE METHOD

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return  await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {

        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000,
        10);

        console.log(changedTimeStamp, JWTTimestamp)

        return JWTTimestamp < changedTimeStamp
    }
    
    return false
}


const User = mongoose.model('User', userSchema)

module.exports = User

